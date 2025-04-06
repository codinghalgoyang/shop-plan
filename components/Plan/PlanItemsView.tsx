import { Item, ItemGroup, Plan } from "@/utils/types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import PlanItemView from "./PlanItemView";
import { Colors } from "@/utils/Colors";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestoreDeleteItemGroup } from "@/utils/api";
import { modalState } from "@/atoms/modalAtom";
import { PlanScreenMode } from "@/app/plan";
import PlanCategoryView from "./PlanCategoryView";
import Paper from "../Common/Paper";
import { Dispatch, SetStateAction } from "react";

interface PlanItemsViewProps {
  plan: Plan;
  planScreenMode: PlanScreenMode;
  activatedItemGroup: ItemGroup | null;
  setActivatedItemGroup: Dispatch<SetStateAction<ItemGroup | null>>;
}

export default function PlanItemsView({
  plan,
  planScreenMode,
  activatedItemGroup,
  setActivatedItemGroup,
}: PlanItemsViewProps) {
  const setModal = useSetRecoilState(modalState);

  // const onItemGroupEditPress = (category: string, itemGroupId: string) => {
  //   const isAlreadyEditing =
  //     planViewStatus.editingCategoryInfo.itemGroupId == itemGroupId;

  //   if (isAlreadyEditing) {
  //     setPlanViewStatus((prev) => {
  //       return {
  //         planViewMode: "ADD_ITEM",
  //         activatedItemGroupId: prev.activatedItemGroupId,
  //         editingItemInfo: { category: "", item: null },
  //         editingCategoryInfo: { category: "", itemGroupId: "" },
  //       };
  //     });
  //   } else {
  //     setPlanViewStatus((prev) => {
  //       return {
  //         planViewMode: "EDIT_CATEGORY",
  //         activatedItemGroupId: prev.activatedItemGroupId,
  //         editingItemInfo: { category: "", item: null },
  //         editingCategoryInfo: { category: category, itemGroupId: itemGroupId },
  //       };
  //     });
  //   }
  // };

  return (
    <ScrollView>
      {plan.itemGroups.map((itemGroup) => {
        return (
          <View key={itemGroup.category}>
            <PlanCategoryView
              itemGroup={itemGroup}
              hasMultipleItemGroup={plan.itemGroups.length > 1}
              activatedItemGroup={activatedItemGroup}
              setActivatedItemGroup={setActivatedItemGroup}
              planScreenMode={planScreenMode}
            />
            <Paper>
              {itemGroup.items.map((item) => {
                return (
                  <PlanItemView
                    key={item.id}
                    plan={plan}
                    itemGroup={itemGroup}
                    item={item}
                    planScreenMode={planScreenMode}
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
