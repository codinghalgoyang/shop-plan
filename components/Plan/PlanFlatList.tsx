import { isItemGroupType, Item, ItemGroup, Plan } from "@/utils/types";
import PlanItemView from "./PlanItemView";
import { useRecoilState } from "recoil";
import { ActivatedItemGroupId, Target } from "@/app/plan";
import PlanCategoryView from "./PlanCategoryView";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ITEM_HEIGHT } from "@/utils/Shapes";
import { scrollTargetState } from "@/atoms/scrollTargetAtom";
import {
  FlatList,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { router } from "expo-router";

interface PlanFlatListProps {
  plan: Plan;
  activatedItemGroupId: ActivatedItemGroupId;
  setActivatedItemGroupId: Dispatch<SetStateAction<ActivatedItemGroupId>>;
}

export default function PlanFlatList({
  plan,
  activatedItemGroupId,
  setActivatedItemGroupId,
}: PlanFlatListProps) {
  const [scrollTarget, setScrollTarget] = useRecoilState(scrollTargetState);
  const [moreTarget, setMoreTarget] = useState<Target>(null);
  const data: (ItemGroup | Item)[] = plan.itemGroups.flatMap((itemGroup) => [
    itemGroup,
    ...itemGroup.items.map((item) => ({ ...item })),
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
    <GestureHandlerRootView>
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
              <TouchableOpacity
                onLongPress={() => {
                  router.push(
                    `/move_item_group?plan_id=${plan.id}&item_group_id=${itemGroup.id}`
                  );
                }}
              >
                <PlanCategoryView
                  plan={plan}
                  itemGroup={itemGroup}
                  hasMultipleItemGroup={plan.itemGroups.length > 1}
                  activatedItemGroupId={activatedItemGroupId}
                  setActivatedItemGroupId={setActivatedItemGroupId}
                  moreTarget={moreTarget}
                  setMoreTarget={setMoreTarget}
                />
              </TouchableOpacity>
            );
          } else {
            const item = itemGroupOrItem as Item;
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
                moreTarget={moreTarget}
                setMoreTarget={setMoreTarget}
              />
            );
          }
        }}
      />
    </GestureHandlerRootView>
  );
}
