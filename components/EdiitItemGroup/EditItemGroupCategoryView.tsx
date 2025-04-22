import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Plan, ItemGroup, Item } from "@/utils/types";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import {
  firestoreChangeItemGroup,
  firestoreDeleteItemGroup,
} from "@/utils/api";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import ThemedTextButton from "../Common/ThemedTextButton";
import { router } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import { Target } from "@/app/plan";
import ThemedIconButton from "../Common/ThemedIconButton";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

interface EditItemGroupCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  drag: () => void;
  moveTarget: Target;
  setMoveTarget: Dispatch<SetStateAction<Target>>;
}

export default function EditItemGroupCategoryView({
  plan,
  itemGroup,
  hasMultipleItemGroup,
  drag,
  moveTarget,
  setMoveTarget,
}: EditItemGroupCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);
  const [editTarget, setEditTarget] = useState<Target>(null);
  const amIMoving = moveTarget?.itemGroupId === itemGroup.id;

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
      title: "카테고리 삭제 확인",
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

  if (!hasMultipleItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  }
  const amICategoryNoneGroup = itemGroup.category === "";

  return (
    <TouchableOpacity
      onPressIn={() => {
        setMoveTarget({
          type: "ITEM_GROUP",
          itemGroupId: itemGroup.id,
          itemId: null,
        });
        drag();
      }}
      disabled={amICategoryNoneGroup}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: amIMoving
              ? Colors.orange
              : Colors.background.white,
          },
        ]}
      >
        <ThemedText
          color={amIMoving ? "white" : "gray"}
          style={{ marginLeft: 16 }}
        >
          {amICategoryNoneGroup ? "카테고리없음" : `#${itemGroup.category}`}
        </ThemedText>
        {/* {!editTarget && ( */}
        <View style={styles.buttonContainer}>
          <ThemedIconButton
            IconComponent={AntDesign}
            iconName="delete"
            onPress={onPressDelete}
            color="gray"
            style={{
              padding: 10,
            }}
          />
          <ThemedIconButton
            IconComponent={AntDesign}
            iconName="form"
            onPress={onPressEdit}
            color="gray"
            style={{
              padding: 10,
            }}
          />
          <ThemedIconButton
            IconComponent={Ionicons}
            iconName="swap-vertical"
            color="gray"
            style={{
              padding: 10,
            }}
          />
        </View>
        {/* )} */}
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
