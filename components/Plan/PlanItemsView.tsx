import { isItemGroupType, Item, ItemGroup, Plan } from "@/utils/types";
import { FlatList, View } from "react-native";
import PlanItemView from "./PlanItemView";
import { useSetRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import {
  ActivatedItemGroupId,
  EditInfo,
  PlanScreenMode,
  ScrollInfo,
} from "@/app/plan";
import PlanCategoryView from "./PlanCategoryView";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Paper from "../Common/Paper";
import { ITEM_HEIGHT } from "@/utils/Shapes";

interface PlanItemsViewProps {
  plan: Plan;
  planScreenMode: PlanScreenMode;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  editInfo: EditInfo;
  setEditInfo: Dispatch<SetStateAction<EditInfo>>;
  scrollInfo: ScrollInfo;
  setScrollInfo: Dispatch<SetStateAction<ScrollInfo>>;
}

export default function PlanItemsView({
  plan,
  planScreenMode,
  activatedItemGroupId,
  setActivatedItemGroupId,
  editInfo,
  setEditInfo,
  scrollInfo,
  setScrollInfo,
}: PlanItemsViewProps) {
  const setModal = useSetRecoilState(modalState);
  const data: (ItemGroup | Item)[] = plan.itemGroups.flatMap((itemGroup) => [
    itemGroup,
    ...itemGroup.items.map((item) => ({ ...item, itemGroup })),
  ]);
  const flatListRef = useRef<FlatList<ItemGroup | Item>>(null);

  useEffect(() => {
    if (scrollInfo && plan) {
      const targetIndex = data.findIndex((item, index) => {
        if (scrollInfo.target == "ITEM_GROUP") {
          if (item.id === scrollInfo.itemGroupId) {
            return true;
          }
        } else {
          if (item.id === scrollInfo.itemId) {
            return true;
          }
        }
      });

      if (targetIndex !== -1) {
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: targetIndex,
        });
      }

      setScrollInfo(null);
    }
  }, [scrollInfo]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(item) => item.id}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      renderItem={({ item: itemGroupOrItem }) => {
        if (isItemGroupType(itemGroupOrItem)) {
          const itemGroup = itemGroupOrItem as ItemGroup;
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
              setScrollInfo={setScrollInfo}
            />
          );
        } else {
          const item = itemGroupOrItem as Item;
          // item안에서 itemGroup 내용을 없애줘야 함
          const itemGroup = plan.itemGroups.find(
            (itemGroup) => itemGroup.id === item.itemGroupId
          );
          if (!itemGroup) {
            return null;
          }

          return (
            <PlanItemView
              key={item.id}
              plan={plan}
              item={item}
              planScreenMode={planScreenMode}
              editInfo={editInfo}
              setEditInfo={setEditInfo}
            />
          );
        }
      }}
    />
  );
}
