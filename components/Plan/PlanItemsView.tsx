import { isItemGroupType, Item, ItemGroup, Plan } from "@/utils/types";
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

type ItemWithItemGroup = {
  itemGroup: ItemGroup;
} & Item;

export default function PlanItemsView({
  plan,
  planScreenMode,
  activatedItemGroupId,
  setActivatedItemGroupId,
  editInfo,
  setEditInfo,
}: PlanItemsViewProps) {
  const setModal = useSetRecoilState(modalState);
  const data: (ItemGroup | ItemWithItemGroup)[] = plan.itemGroups.flatMap(
    (itemGroup) => [
      itemGroup,
      ...itemGroup.items.map((item) => ({ ...item, itemGroup })),
    ]
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item: itemGroupOrItemWithItemGroup }) => {
        if (isItemGroupType(itemGroupOrItemWithItemGroup)) {
          const itemGroup = itemGroupOrItemWithItemGroup as ItemGroup;
          return (
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
          );
        } else {
          const item = itemGroupOrItemWithItemGroup as ItemWithItemGroup;
          return (
            <Paper>
              <PlanItemView
                key={item.id}
                plan={plan}
                itemGroup={item.itemGroup}
                item={item}
                planScreenMode={planScreenMode}
                editInfo={editInfo}
                setEditInfo={setEditInfo}
              />
            </Paper>
          );
        }
      }}
    />
  );
}
