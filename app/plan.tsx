import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";
import { useEffect, useState } from "react";
import PlanHeader from "@/components/Plan/PlanHeader";
import PlanCoupangButton from "@/components/Plan/PlanCoupanButton";
import PlanItemsView from "@/components/Plan/PlanItemsView";
import PlanItemDeleteButtonView from "@/components/Plan/PlanItemDeleteButtonView";
import AddItemInput from "@/components/Plan/AddItemInput";
import EditItemInput from "@/components/Plan/EditItemInput";
import EditItemGroupInput from "@/components/Plan/EditItemGroupInput";
import { isItemGroupType, isItemType, Item, ItemGroup } from "@/utils/types";
import { findDefaultItemGroupId, findItem, findItemGroup } from "@/utils/utils";
import ThemedText from "@/components/Common/ThemedText";
import EditGuide from "@/components/Plan/EditGuide";
import { scrollTargetState } from "@/atoms/scrollTargetAtom";

export type Target = {
  type: "ITEM_GROUP" | "ITEM";
  itemGroupId: string;
  itemId: string | null;
} | null;

// TODO: 정리, ItemGroup으로 직접넣으니, 누군가 ItemGroups를 수정했을때, 이것도 다시 업데이트 해줘야하는 문제가 생긴다. id를 가지고 하자
export type ActivatedItemGroupId = string | null;

export default function PlanScreen() {
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  const setting = useRecoilValue(settingState);
  const [activatedItemGroupId, setActivatedItemGroupId] =
    useState<ActivatedItemGroupId>(null);
  const [scrollTarget, setScrollTarget] = useRecoilState(scrollTargetState);

  // TODO : 이걸 useEffect로 빼면 에러가나네. 왜그럴까?
  if (setting.aodEnabled) {
    useKeepAwake();
  }

  useEffect(() => {
    if (!plan) {
      router.back();
      return;
    }
  }, [plan]);

  useEffect(() => {
    // 누군가 itemGroups를 변경했다면, activatedItemGroupId와 editInfo가 수정 필요함
    if (plan?.itemGroups) {
      if (
        activatedItemGroupId == null ||
        findItemGroup(plan, activatedItemGroupId) == undefined // 누군가 activatedItemGroup을 삭제하는 경우
      ) {
        // activatedItemGroupId 초기화
        setActivatedItemGroupId(findDefaultItemGroupId(plan));
      }
    }
  }, [plan?.itemGroups]);

  if (!plan) {
    return null;
  }
  return (
    <ScreenView>
      <PlanHeader plan={plan} />
      <View style={styles.container}>
        <PlanCoupangButton />
        <PlanItemsView
          plan={plan}
          activatedItemGroupId={activatedItemGroupId}
          setActivatedItemGroupId={setActivatedItemGroupId}
        />
      </View>
      <AddItemInput
        plan={plan}
        activatedItemGroupId={activatedItemGroupId}
        setActivatedItemGroupId={setActivatedItemGroupId}
      />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
});
