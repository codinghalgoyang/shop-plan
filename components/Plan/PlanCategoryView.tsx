import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { isItemGroupType, Plan, ItemGroup } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { PlanScreenEditTarget, PlanScreenMode } from "@/app/plan";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { firestoreDeleteItemGroup } from "@/utils/api";

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  activatedItemGroup: ItemGroup | null;
  setActivatedItemGroup: Dispatch<SetStateAction<ItemGroup | null>>;
  planScreenMode: PlanScreenMode;
  editTarget: PlanScreenEditTarget;
  setEditTarget: Dispatch<SetStateAction<PlanScreenEditTarget>>;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  hasMultipleItemGroup,
  activatedItemGroup,
  setActivatedItemGroup,
  planScreenMode,
  editTarget,
  setEditTarget,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);

  // just return border
  if (!hasMultipleItemGroup || !activatedItemGroup) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  } else {
    const isCategoryNoneItemGroup = itemGroup.category == "";
    const isAlreadyEditing =
      isItemGroupType(editTarget) && editTarget.id == itemGroup.id;

    const deleteCategory = async () => {
      setModal({
        visible: true,
        title: "삭제 확인",
        message: `${itemGroup.category} 안에 있는 항목도 모두 삭제됩니다.`,
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

    const onItemGroupEditPress = () => {
      if (isAlreadyEditing) return;
      setEditTarget(itemGroup);
    };

    // TODO : Do not display delete/edit button if it's isCategoryNoneItemGroup
    return (
      <TouchableOpacity
        onPress={() => {
          setActivatedItemGroup(itemGroup);
        }}
      >
        <View style={styles.container}>
          <ThemedText
            color={itemGroup.id == activatedItemGroup.id ? "blue" : "gray"}
            style={{ marginLeft: 16 }}
          >
            {isCategoryNoneItemGroup ? "분류없음" : `#${itemGroup.category}`}
          </ThemedText>
          {planScreenMode == "EDIT" && (
            <ThemedTextButton
              color={isAlreadyEditing ? "orange" : "gray"}
              onPress={onItemGroupEditPress}
            >
              {isAlreadyEditing ? "편집중" : "편집"}
            </ThemedTextButton>
          )}
          {planScreenMode == "DELETE" && (
            <ThemedTextButton
              color="orange"
              size="small"
              onPress={deleteCategory}
            >
              삭제
            </ThemedTextButton>
          )}
          {/*
                <ThemedTextButton
                  color={
                    itemGroup.id ==
                    planViewStatus.editingCategoryInfo.itemGroupId
                      ? "blue"
                      : "gray"
                  }
                  size="small"
                  onPress={() => {
                    onItemGroupEditPress(itemGroup.category, itemGroup.id);
                  }}
                  buttonStyle={{ marginRight: 8 }}
                >
                  {itemGroup.id ==
                  planViewStatus.editingCategoryInfo.itemGroupId
                    ? "편집중"
                    : "편집"}
                </ThemedTextButton>
              */}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
    paddingVertical: 8,
  },
});
