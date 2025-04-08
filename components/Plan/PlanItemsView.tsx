import { ItemGroup, Plan } from "@/utils/types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import PlanItemView from "./PlanItemView";
import { Colors } from "@/utils/Colors";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import { ActivatedItemGroupId, EditInfo, PlanScreenMode } from "@/app/plan";
import PlanCategoryView from "./PlanCategoryView";
import Paper from "../Common/Paper";
import { Dispatch, SetStateAction } from "react";

interface PlanItemsViewProps {
  plan: Plan;
  planScreenMode: PlanScreenMode;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  editInfo: EditInfo;
  setEditInfo: Dispatch<SetStateAction<EditInfo>>;
}

export default function PlanItemsView({
  plan,
  planScreenMode,
  activatedItemGroupId,
  setActivatedItemGroupId,
  editInfo,
  setEditInfo,
}: PlanItemsViewProps) {
  const setModal = useSetRecoilState(modalState);

  return (
    <ScrollView>
      {plan.itemGroups.map((itemGroup) => {
        return (
          <View key={itemGroup.id}>
            <PlanCategoryView
              plan={plan}
              itemGroup={itemGroup}
              hasMultipleItemGroup={plan.itemGroups.length > 1}
              planScreenMode={planScreenMode}
              activatedItemGroupId={activatedItemGroupId}
              setActivatedItemGroupId={setActivatedItemGroupId}
              editInfo={editInfo}
              setEditInfo={setEditInfo}
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
                    editInfo={editInfo}
                    setEditInfo={setEditInfo}
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
