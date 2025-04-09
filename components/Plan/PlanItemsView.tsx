import { Plan } from "@/utils/types";
import { FlatList, View } from "react-native";
import PlanItemView from "./PlanItemView";
import { useSetRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import { ActivatedItemGroupId, EditInfo, PlanScreenMode } from "@/app/plan";
import PlanCategoryView from "./PlanCategoryView";
import { Dispatch, SetStateAction } from "react";
import Paper from "../Common/Paper";

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
    <FlatList
      data={plan.itemGroups}
      keyExtractor={(item) => item.id}
      renderItem={({ item: itemGroup }) => {
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
            <FlatList
              data={itemGroup.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <Paper>
                    <PlanItemView
                      key={item.id}
                      plan={plan}
                      itemGroup={itemGroup}
                      item={item}
                      planScreenMode={planScreenMode}
                      editInfo={editInfo}
                      setEditInfo={setEditInfo}
                    />
                  </Paper>
                );
              }}
            />
          </View>
        );
      }}
    />
  );
}
