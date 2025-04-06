import { ItemGroup, Plan } from "@/utils/types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import PlanItemView from "./PlanItemView";
import { Colors } from "@/utils/Colors";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestoreDeleteItemGroup } from "@/utils/api";
import { modalState } from "@/atoms/modalAtom";
import { PlanScreenEditTarget, PlanScreenMode } from "@/app/plan";
import PlanCategoryView from "./PlanCategoryView";
import Paper from "../Common/Paper";
import { Dispatch, SetStateAction } from "react";

interface PlanItemsViewProps {
  plan: Plan;
  planScreenMode: PlanScreenMode;
  activatedItemGroup: ItemGroup | null;
  setActivatedItemGroup: Dispatch<SetStateAction<ItemGroup | null>>;
  editTarget: PlanScreenEditTarget;
  setEditTarget: Dispatch<SetStateAction<PlanScreenEditTarget>>;
}

export default function PlanItemsView({
  plan,
  planScreenMode,
  activatedItemGroup,
  setActivatedItemGroup,
  editTarget,
  setEditTarget,
}: PlanItemsViewProps) {
  const setModal = useSetRecoilState(modalState);

  return (
    <ScrollView>
      {plan.itemGroups.map((itemGroup) => {
        return (
          <View key={itemGroup.category}>
            <PlanCategoryView
              plan={plan}
              itemGroup={itemGroup}
              hasMultipleItemGroup={plan.itemGroups.length > 1}
              activatedItemGroup={activatedItemGroup}
              setActivatedItemGroup={setActivatedItemGroup}
              planScreenMode={planScreenMode}
              editTarget={editTarget}
              setEditTarget={setEditTarget}
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
                    editTarget={editTarget}
                    setEditTarget={setEditTarget}
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
