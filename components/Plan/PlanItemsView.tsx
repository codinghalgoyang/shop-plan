import { Plan } from "@/utils/types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import Paper from "../Common/Paper";
import PlanItemView from "./PlanItemView";
import { Colors } from "@/utils/Colors";
import { useRecoilState, useSetRecoilState } from "recoil";
import { planViewStatusState } from "@/atoms/planViewStatusAtom";
import { firestoreDeleteItemGroup } from "@/utils/api";
import { modalState } from "@/atoms/modalAtom";
import { useEffect } from "react";

interface PlanItemsViewProps {
  plan: Plan;
}

export default function PlanItemsView({ plan }: PlanItemsViewProps) {
  const setModal = useSetRecoilState(modalState);
  const [planViewStatus, setPlanViewStatus] =
    useRecoilState(planViewStatusState);

  const onItemGroupEditPress = (category: string, itemGroupId: string) => {
    const isAlreadyEditing =
      planViewStatus.editingCategoryInfo.itemGroupId == itemGroupId;

    if (isAlreadyEditing) {
      setPlanViewStatus((prev) => {
        return {
          planViewMode: "ADD_ITEM",
          activatedItemGroupId: prev.activatedItemGroupId,
          editingItemInfo: { category: "", item: null },
          editingCategoryInfo: { category: "", itemGroupId: "" },
        };
      });
    } else {
      setPlanViewStatus((prev) => {
        return {
          planViewMode: "EDIT_CATEGORY",
          activatedItemGroupId: prev.activatedItemGroupId,
          editingItemInfo: { category: "", item: null },
          editingCategoryInfo: { category: category, itemGroupId: itemGroupId },
        };
      });
    }
  };

  return (
    <ScrollView>
      {plan.itemGroups.map((itemGroup) => {
        return (
          <View key={itemGroup.category}>
            <TouchableOpacity
              onPress={() => {
                setPlanViewStatus((prev) => {
                  return {
                    ...prev,
                    activatedItemGroupId: itemGroup.id,
                  };
                });
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomWidth: 0.5,
                  borderColor: Colors.border,
                  paddingVertical: 8,
                }}
              >
                <ThemedText
                  color={
                    planViewStatus.activatedItemGroupId == itemGroup.id &&
                    plan.itemGroups.length !== 1
                      ? "blue"
                      : "gray"
                  }
                  style={{ marginLeft: 16 }}
                >
                  {planViewStatus.activatedItemGroupId == itemGroup.id &&
                  plan.itemGroups.length !== 1
                    ? `#${itemGroup.category} (현재분류)`
                    : `#${itemGroup.category}`}
                </ThemedText>
                {planViewStatus.planViewMode == "DELETE" ? (
                  <ThemedTextButton
                    color="orange"
                    size="small"
                    onPress={async () => {
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
                    }}
                  >
                    삭제
                  </ThemedTextButton>
                ) : (
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
                )}
              </View>
            </TouchableOpacity>
            <Paper>
              {itemGroup.items.map((item) => {
                if (item.checked) return null;
                return (
                  <PlanItemView
                    key={item.title + item.createdAt}
                    plan={plan}
                    category={itemGroup.category}
                    item={item}
                  />
                );
              })}
              {itemGroup.items.map((item) => {
                if (!item.checked) return null;
                return (
                  <PlanItemView
                    key={item.title + item.createdAt}
                    plan={plan}
                    category={itemGroup.category}
                    item={item}
                  />
                );
              })}
            </Paper>
          </View>
        );
      })}
    </ScrollView>
  );
}
