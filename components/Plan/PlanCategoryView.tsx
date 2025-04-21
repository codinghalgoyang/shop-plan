import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Plan, ItemGroup } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { ActivatedItemGroupId, Target } from "@/app/plan";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import ThemedIconButton from "../Common/ThemedIconButton";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import ThemedTextButton from "../Common/ThemedTextButton";
import { firestoreDeleteItemGroup } from "@/utils/api";

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  moreTarget: Target;
  setMoreTarget: Dispatch<SetStateAction<Target>>;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  hasMultipleItemGroup,
  activatedItemGroupId,
  setActivatedItemGroupId,
  moreTarget,
  setMoreTarget,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);
  const amICategoryNoneGroup = itemGroup.category === "";
  const amIActivated = itemGroup.id === activatedItemGroupId;
  const amIMoreTarget =
    moreTarget?.type === "ITEM_GROUP" &&
    moreTarget.itemGroupId === itemGroup.id;

  const onPressEdit = () => {
    router.push(
      `/edit_item_group?plan_id=${plan.id}&item_group_id=${itemGroup.id}`
    );
    setMoreTarget(null);
  };

  const onPressDelete = async () => {
    setModal({
      visible: true,
      title: "카테고리 삭제 확인",
      message: `'${itemGroup.category}' 카테고리 안에 있는 모든 항목도 함께 삭제됩니다.`,
      onConfirm: async () => {
        try {
          router.back();
          await firestoreDeleteItemGroup(plan, itemGroup.id);
          setMoreTarget(null);
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

  const onPressMore = () => {
    if (amIMoreTarget) {
      setMoreTarget(null);
    } else {
      setMoreTarget({
        type: "ITEM_GROUP",
        itemGroupId: itemGroup.id,
        itemId: null,
      });
    }
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
      }}
    >
      <View style={styles.container}>
        <ThemedText
          color={amIActivated ? "blue" : "gray"}
          style={{ marginLeft: 16 }}
        >
          {amICategoryNoneGroup ? "카테고리없음" : `#${itemGroup.category}`}
        </ThemedText>
        {amICategoryNoneGroup ? null : (
          <View style={styles.buttonContainer}>
            <ThemedTextButton color="blue" onPress={onPressEdit}>
              수정
            </ThemedTextButton>
            <ThemedTextButton color="orange" onPress={onPressDelete}>
              삭제
            </ThemedTextButton>
            <ThemedIconButton
              IconComponent={Feather}
              iconName={amIMoreTarget ? "chevron-right" : "chevron-left"}
              color={amIMoreTarget ? "black" : "gray"}
              style={{ marginRight: 8 }}
              onPress={onPressMore}
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
