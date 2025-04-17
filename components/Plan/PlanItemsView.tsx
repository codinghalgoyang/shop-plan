import { isItemGroupType, Item, ItemGroup, Plan } from "@/utils/types";
import { FlatList, View } from "react-native";
import PlanItemView from "./PlanItemView";
import { useSetRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import { ActivatedItemGroupId, Target } from "@/app/plan";
import PlanCategoryView from "./PlanCategoryView";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Paper from "../Common/Paper";
import { ITEM_HEIGHT } from "@/utils/Shapes";

interface PlanItemsViewProps {
  plan: Plan;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
  editTarget: Target;
  setEditTarget: Dispatch<SetStateAction<Target>>;
  scrollTarget: Target;
  setScrollTarget: Dispatch<SetStateAction<Target>>;
  moreTarget: Target;
  setMoreTarget: Dispatch<SetStateAction<Target>>;
}

export default function PlanItemsView({
  plan,
  activatedItemGroupId,
  setActivatedItemGroupId,
  editTarget,
  setEditTarget,
  scrollTarget,
  setScrollTarget,
  moreTarget,
  setMoreTarget,
}: PlanItemsViewProps) {
  const setModal = useSetRecoilState(modalState);
  const data: (ItemGroup | Item)[] = plan.itemGroups.flatMap((itemGroup) => [
    itemGroup,
    ...itemGroup.items.map((item) => ({ ...item, itemGroup })),
  ]);
  const flatListRef = useRef<FlatList<ItemGroup | Item>>(null);

  useEffect(() => {
    if (scrollTarget && plan) {
      const targetIndex = data.findIndex((item, index) => {
        if (scrollTarget.type == "ITEM_GROUP") {
          if (item.id === scrollTarget.itemGroupId) {
            return true;
          }
        } else {
          if (item.id === scrollTarget.itemId) {
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

      setScrollTarget(null);
    }
  }, [scrollTarget]);

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
              activatedItemGroupId={activatedItemGroupId}
              setActivatedItemGroupId={setActivatedItemGroupId}
              editTarget={editTarget}
              setEditTarget={setEditTarget}
              setScrollTarget={setScrollTarget}
              moreTarget={moreTarget}
              setMoreTarget={setMoreTarget}
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
              editTarget={editTarget}
              setEditTarget={setEditTarget}
              moreTarget={moreTarget}
              setMoreTarget={setMoreTarget}
            />
          );
        }
      }}
    />
  );
}
