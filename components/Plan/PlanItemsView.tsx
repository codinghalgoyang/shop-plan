import { Plan } from "@/utils/types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import Paper from "../Common/Paper";
import PlanItemView from "./PlanItemView";
import { Dispatch, SetStateAction } from "react";

function getCategories(plan: Plan) {
  const allCategories = plan?.items.map((item) => item.category);
  const uniqueCategories = [...new Set(allCategories)];
  return uniqueCategories;
}

interface PlanItemsViewProps {
  plan: Plan;
  editItemIdx: number;
  setEditItemIdx: Dispatch<SetStateAction<number>>;
  isDeleteMode: boolean;
  setCategory: Dispatch<SetStateAction<string>>;
  extraEnabled: boolean;
  setExtraEnabled: Dispatch<SetStateAction<boolean>>;
  isEditing: boolean;
}

export default function PlanItemsView({
  plan,
  editItemIdx,
  setEditItemIdx,
  isDeleteMode,
  setCategory,
  extraEnabled,
  setExtraEnabled,
  isEditing,
}: PlanItemsViewProps) {
  const categories = getCategories(plan);

  return (
    <ScrollView contentContainerStyle={{ gap: 8 }}>
      {categories.map((category) => {
        return (
          <View key={category} style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                } else {
                  if (category !== "") {
                    setExtraEnabled(true);
                  } else {
                    setExtraEnabled(false);
                  }
                  setCategory(category);
                }
              }}
            >
              <View>
                <ThemedText
                  size="small"
                  color="gray"
                  style={{ marginLeft: 12 }}
                >
                  {categories.length == 1 && categories[0] == ""
                    ? "구매 항목"
                    : category == ""
                    ? "분류 없음"
                    : category}
                </ThemedText>
              </View>
            </TouchableOpacity>
            <Paper>
              {plan?.items.map((planItem, itemIdx) => {
                if (planItem.checked) return null;
                if (planItem.category !== category) return null;
                return (
                  <PlanItemView
                    key={planItem.title + planItem.createdAt}
                    plan={plan}
                    itemIdx={itemIdx}
                    needTopBorder={itemIdx == 0}
                    editItemIdx={editItemIdx}
                    setEditItemIdx={setEditItemIdx}
                    isDeleteMode={isDeleteMode}
                  />
                );
              })}
              {plan?.items.map((planItem, itemIdx) => {
                if (!planItem.checked) return null;
                if (planItem.category !== category) return null;
                return (
                  <PlanItemView
                    key={planItem.title + planItem.createdAt}
                    plan={plan}
                    itemIdx={itemIdx}
                    needTopBorder={itemIdx == 0}
                    editItemIdx={editItemIdx}
                    setEditItemIdx={setEditItemIdx}
                    isDeleteMode={isDeleteMode}
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
