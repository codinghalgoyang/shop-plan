import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { isItemGroupType, Plan, ItemGroup } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { ActivatedItemGroupId, EditInfo, PlanScreenMode } from "@/app/plan";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { firestoreDeleteItemGroup } from "@/utils/api";

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  planScreenMode: PlanScreenMode;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  editInfo: EditInfo;
  setEditInfo: Dispatch<SetStateAction<EditInfo>>;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  hasMultipleItemGroup,
  planScreenMode,
  activatedItemGroupId,
  setActivatedItemGroupId,
  editInfo,
  setEditInfo,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);

  // just return border
  if (!hasMultipleItemGroup || !activatedItemGroupId) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  } else {
    const isCategoryNoneItemGroup = itemGroup.category == "";
    const isAlreadyEditing =
      editInfo?.target == "ITEM_GROUP" && editInfo.itemGroupId == itemGroup.id;

    const deleteCategory = async () => {
      setModal({
        visible: true,
        title: "삭제 확인",
        message:
          itemGroup.category == ""
            ? "'분류없음' 안에 있는 모든 항목도 함께 삭제 됩니다."
            : `'${itemGroup.category}' 카테고리 안에 있는 모든 항목도 함께 삭제됩니다.`,
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

    // TODO : Do not display delete/edit button if it's isCategoryNoneItemGroup
    return (
      <TouchableOpacity
        disabled={planScreenMode == "DELETE"}
        onPress={() => {
          if (planScreenMode == "ADD_ITEM") {
            setActivatedItemGroupId(itemGroup.id);
          } else if (planScreenMode == "EDIT") {
            if (itemGroup.category !== "") {
              setEditInfo({
                target: "ITEM_GROUP",
                itemGroupId: itemGroup.id,
                itemId: null,
              });
            }
          }
        }}
      >
        <View style={styles.container}>
          <ThemedText
            color={
              planScreenMode == "EDIT" &&
              editInfo?.target == "ITEM_GROUP" &&
              editInfo.itemGroupId == itemGroup.id
                ? "orange"
                : planScreenMode == "ADD_ITEM" &&
                  itemGroup.id == activatedItemGroupId
                ? "blue"
                : "gray"
            }
            style={{ marginLeft: 16 }}
          >
            {isCategoryNoneItemGroup
              ? "분류없음"
              : planScreenMode == "EDIT" &&
                editInfo?.target == "ITEM_GROUP" &&
                editInfo?.itemGroupId == itemGroup.id
              ? `#${itemGroup.category}(편집중)`
              : `#${itemGroup.category}`}
          </ThemedText>
          {planScreenMode == "DELETE" && itemGroup.category !== "" && (
            <ThemedTextButton
              color="orange"
              onPress={deleteCategory}
              style={{ marginRight: 20 }}
            >
              삭제
            </ThemedTextButton>
          )}
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
