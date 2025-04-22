import {
  isItemGroupType,
  isItemType,
  Item,
  ItemGroup,
  Plan,
} from "@/utils/types";
import PlanItemView from "./PlanItemView";
import { useRecoilState, useSetRecoilState } from "recoil";
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
import { editTargetState } from "@/atoms/editTargetAtom";
import DraggableFlatList from "react-native-draggable-flatlist";
import { firestoreChangeItemOrder } from "@/utils/api";
import { modalState } from "@/atoms/modalAtom";

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
  const setModal = useSetRecoilState(modalState);
  const flatListRef = useRef<FlatList<ItemGroup | Item>>(null);
  const [scrollTarget, setScrollTarget] = useRecoilState(scrollTargetState);
  const [moveTarget, setMoveTarget] = useState<Target>(null);
  const data: (ItemGroup | Item)[] = plan.itemGroups.flatMap((itemGroup) => [
    itemGroup,
    ...itemGroup.items.map((item) => ({ ...item })),
  ]);

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

  const onDragEnd = async (data: (Item | ItemGroup)[]) => {
    setMoveTarget(null);
    if (isItemType(data[0])) return;
    console.log(data);
    try {
      // if (!activatedItemGroupId) return;
      await firestoreChangeItemOrder(plan, data);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  return (
    <GestureHandlerRootView>
      <DraggableFlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onDragEnd={(data) => {
          onDragEnd(data.data);
        }}
        renderItem={({ item: itemGroupOrItem, drag }) => {
          if (isItemGroupType(itemGroupOrItem)) {
            const itemGroup = itemGroupOrItem as ItemGroup;
            return (
              <PlanCategoryView
                plan={plan}
                itemGroup={itemGroup}
                hasMultipleItemGroup={plan.itemGroups.length > 1}
                activatedItemGroupId={activatedItemGroupId}
                setActivatedItemGroupId={setActivatedItemGroupId}
                moveTarget={moveTarget}
              />
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
                drag={drag}
                moveTarget={moveTarget}
                setMoveTarget={setMoveTarget}
              />
            );
          }
        }}
      />
    </GestureHandlerRootView>
  );
}
