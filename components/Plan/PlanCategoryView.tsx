import { Colors } from "@/utils/Colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { isItemGroupType, Plan, ItemGroup } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import { ActivatedItemGroupId, Target } from "@/app/plan";
import ThemedTextButton from "../Common/ThemedTextButton";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";
import { firestoreDeleteItemGroup } from "@/utils/api";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import ThemedIconButton from "../Common/ThemedIconButton";
import Feather from "@expo/vector-icons/Feather";
import ThemedIcon from "../Common/ThemedIcon";

interface PlanCategoryViewProps {
  plan: Plan;
  itemGroup: ItemGroup;
  hasMultipleItemGroup: boolean;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  editTarget: Target;
  setEditTarget: Dispatch<SetStateAction<Target>>;
  setScrollTarget: Dispatch<SetStateAction<Target>>;
  moreTarget: Target;
  setMoreTarget: Dispatch<SetStateAction<Target>>;
}

export default function PlanCategoryView({
  plan,
  itemGroup,
  hasMultipleItemGroup,
  activatedItemGroupId,
  setActivatedItemGroupId,
  editTarget,
  setEditTarget,
  setScrollTarget,
  moreTarget,
  setMoreTarget,
}: PlanCategoryViewProps) {
  const setModal = useSetRecoilState(modalState);

  if (!hasMultipleItemGroup || !activatedItemGroupId) {
    return (
      <View style={{ borderColor: Colors.border, borderBottomWidth: 0.5 }} />
    );
  } else {
    const amICategoryNoneGroup = itemGroup.category === "";
    const amIMoreTarget =
      moreTarget?.type === "ITEM_GROUP" &&
      moreTarget?.itemGroupId === itemGroup.id;
    const amIEditingTarget =
      editTarget?.type == "ITEM_GROUP" &&
      editTarget.itemGroupId == itemGroup.id;
    const amIActivated = itemGroup.id == activatedItemGroupId;
    // just return border

    const deleteCategory = async () => {
      setModal({
        visible: true,
        title: "삭제 확인",
        message:
          itemGroup.category == ""
            ? "'미분류' 안에 있는 모든 항목도 함께 삭제 됩니다."
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
        onPress={() => {
          setActivatedItemGroupId(itemGroup.id);
        }}
      >
        <View style={styles.container}>
          <ThemedText
            color={
              editTarget?.type === "ITEM_GROUP" && amIEditingTarget
                ? "orange"
                : editTarget?.type === "ITEM_GROUP" && !amIEditingTarget
                ? "gray"
                : editTarget?.type === "ITEM" &&
                  editTarget.itemGroupId === itemGroup.id
                ? "orange"
                : editTarget?.type === "ITEM" &&
                  editTarget.itemGroupId !== itemGroup.id
                ? "gray"
                : !editTarget && amIActivated
                ? "blue"
                : "gray"
            }
            style={{ marginLeft: 16 }}
          >
            {amICategoryNoneGroup
              ? "미분류"
              : amIEditingTarget
              ? `#${itemGroup.category}(편집중)`
              : `#${itemGroup.category}`}
          </ThemedText>
          {!editTarget && (
            <View style={styles.buttonContainer}>
              {amIMoreTarget && (
                <ThemedTextButton
                  color="blue"
                  onPress={() => {
                    setEditTarget({
                      type: "ITEM_GROUP",
                      itemGroupId: itemGroup.id,
                      itemId: null,
                    });
                    setMoreTarget(null);
                  }}
                  style={{ marginRight: 20 }}
                >
                  편집
                </ThemedTextButton>
              )}
              {amIMoreTarget && (
                <ThemedTextButton
                  color="orange"
                  onPress={deleteCategory}
                  style={{ marginRight: 20 }}
                >
                  삭제
                </ThemedTextButton>
              )}
              {itemGroup.category !== "" && (
                <ThemedIconButton
                  IconComponent={Feather}
                  iconName="more-vertical"
                  color={amIMoreTarget ? "black" : "gray"}
                  style={{ marginRight: 8 }}
                  onPress={() => {
                    if (amIMoreTarget) {
                      setMoreTarget(null);
                    } else {
                      setMoreTarget({
                        type: "ITEM_GROUP",
                        itemGroupId: itemGroup.id,
                        itemId: null,
                      });
                    }
                  }}
                />
              )}
            </View>
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
    height: ITEM_HEIGHT,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
