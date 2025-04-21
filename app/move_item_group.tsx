import { plansState } from "@/atoms/plansAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { findItemGroup, param2string } from "@/utils/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ItemGroup } from "@/utils/types";

import DraggableFlatList, {
  DraggableFlatListProps,
  RenderItemParams,
} from "react-native-draggable-flatlist";

import {
  FlatList,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import MoveItemGroupCategoryView from "@/components/MoveItemGroup.tsx/MoveItemGroupCategoryView";

export default function MoveItemGroupScreen() {
  const { plan_id: planId, item_group_id: movingItemGroupId } =
    useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  const movingItemGroup = findItemGroup(plan, param2string(movingItemGroupId));

  useEffect(() => {
    if (!plan) {
      router.back();
      return;
    }
  }, [plan]);

  if (!plan || !movingItemGroup) {
    return null;
  }
  const data: ItemGroup[] = plan.itemGroups;

  return (
    <ScreenView>
      <Header title={`카테고리 이동중`} color="orange" />
      <DraggableFlatList
        data={data}
        keyExtractor={(item) => item.id}
        // getItemLayout={(data, index) => ({
        //   length: ITEM_HEIGHT,
        //   offset: ITEM_HEIGHT * index,
        //   index,
        // })}
        renderItem={({
          item: itemGroup,
          drag,
        }: RenderItemParams<ItemGroup>) => {
          const amIMoving = itemGroup.id === movingItemGroup.id;
          if (amIMoving) {
            drag();
          }
          return (
            <MoveItemGroupCategoryView
              plan={plan}
              itemGroup={itemGroup}
              movingItemGroup={movingItemGroup}
              hasMultipleItemGroup={plan.itemGroups.length > 1}
            />
          );
        }}
        onDragEnd={(data) => {
          console.log(data);
        }}
      />
    </ScreenView>
  );
}
