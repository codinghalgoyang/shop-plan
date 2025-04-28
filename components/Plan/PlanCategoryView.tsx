import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Plan, ItemGroup } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { ActivatedItemGroupId, AddItemInputMode, Target } from "@/app/plan";
import { modalState } from "@/atoms/modalAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import { firestoreDeleteItemGroup } from "@/utils/api";
import { editTargetState } from "@/atoms/editTargetAtom";
import ThemedIconButton from "../Common/ThemedIconButton";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  moveTarget: Target;
  addItemInputMode: AddItemInputMode;
  setAddItemInputMode: Dispatch<SetStateAction<AddItemInputMode>>;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  hasMultipleItemGroup,
  activatedItemGroupId,
  setActivatedItemGroupId,
  moveTarget,
  addItemInputMode,
  setAddItemInputMode,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);
  const [editTarget, setEditTarget] = useRecoilState(editTargetState);
  const amICategoryNoneGroup = itemGroup.category === "";
  const amIActivated = itemGroup.id === activatedItemGroupId;
  const amIEditTarget =
    editTarget?.type === "ITEM_GROUP" &&
    editTarget.itemGroupId === itemGroup.id;

  const onPressEdit = () => {
    setEditTarget({
      type: "ITEM_GROUP",
      itemGroupId: itemGroup.id,
      itemId: null,
    });
  };

  const onPressDelete = async () => {
    setModal({
      visible: true,
      title: "카테고리 삭제",
      message: `'${itemGroup.category}' 카테고리 안에 있는 모든 항목도 함께 삭제됩니다.`,
      onConfirm: async () => {
        try {
          await firestoreDeleteItemGroup(plan, itemGroup.id);
        } catch (error) {
          setModal({
            visible: true,
            title: "서버 통신 에러",
            message: `서버와 연결상태가 좋지 않습니다. (${error})`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  const onLongPress = async () => {
    router.push(`/move_item_group?plan_id=${plan.id}`);
  };

  if (!hasMultipleItemGroup || !activatedItemGroupId) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  }

  return (
    <TouchableOpacity
      onPress={async () => {
        setActivatedItemGroupId(itemGroup.id);
        if (addItemInputMode === "CATEGORY") {
          setAddItemInputMode("ITEM");
        }
      }}
      onLongPress={onLongPress}
      disabled={editTarget ? true : false}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: amIEditTarget ? Colors.orange : Colors.border },
        ]}
      >
        <ThemedText
          color={
            editTarget
              ? amIEditTarget
                ? "white"
                : "gray"
              : amIActivated
              ? "blue"
              : "gray"
          }
          style={{ marginLeft: 16 }}
        >
          {amICategoryNoneGroup ? "카테고리없음" : `#${itemGroup.category}`}
        </ThemedText>
        {amIEditTarget && (
          <ThemedText color={"white"} style={{ marginRight: 16 }}>
            (수정중)
          </ThemedText>
        )}

        {!editTarget && !amICategoryNoneGroup && !moveTarget && (
          <View style={styles.buttonContainer}>
            <ThemedIconButton
              IconComponent={AntDesign}
              iconName="form"
              onPress={onPressEdit}
              color="gray"
              bgGray
              style={{
                padding: 12,
              }}
            />
            <ThemedIconButton
              IconComponent={AntDesign}
              iconName="delete"
              onPress={onPressDelete}
              color="gray"
              bgGray
              style={{
                padding: 12,
                marginRight: 8,
              }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    height: ITEM_HEIGHT,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
