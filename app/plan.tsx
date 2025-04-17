import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { BackHandler, StyleSheet, View } from "react-native";
import { useRecoilValue } from "recoil";
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
  const [editTarget, setEditTarget] = useState<Target>(null);
  const [scrollTarget, setScrollTarget] = useState<Target>(null);
  const [moreTarget, setMoreTarget] = useState<Target>(null);

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

      if (editTarget) {
        if (editTarget.type == "ITEM") {
          if (!editTarget.itemId) {
            throw new Error("editInfo doesn't have itemId!");
          }
          if (!findItem(plan, editTarget.itemGroupId, editTarget.itemId)) {
            setEditTarget(null);
          }
        } else if (editTarget.type == "ITEM_GROUP") {
          if (!findItemGroup(plan, editTarget.itemGroupId)) {
            setEditTarget(null);
          }
        }
      }
    }
  }, [plan?.itemGroups]);

  useEffect(() => {
    const backAction = () => {
      if (editTarget) {
        setEditTarget(null);
        return true; // 이벤트 전파를 막음
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, [editTarget]);

  if (!plan) {
    return null;
  } else {
    return (
      <ScreenView>
        <PlanHeader plan={plan} />
        <View style={styles.container}>
          {!editTarget && <PlanCoupangButton />}
          <PlanItemsView
            plan={plan}
            activatedItemGroupId={activatedItemGroupId}
            setActivatedItemGroupId={setActivatedItemGroupId}
            editTarget={editTarget}
            setEditTarget={setEditTarget}
            scrollTarget={scrollTarget}
            setScrollTarget={setScrollTarget}
            moreTarget={moreTarget}
            setMoreTarget={setMoreTarget}
          />
        </View>
        {!editTarget ? (
          <AddItemInput
            plan={plan}
            activatedItemGroupId={activatedItemGroupId}
            setActivatedItemGroupId={setActivatedItemGroupId}
            setScrollTarget={setScrollTarget}
          />
        ) : editTarget.type === "ITEM" ? (
          <EditItemInput
            plan={plan}
            editTarget={editTarget}
            setEditTarget={setEditTarget}
          />
        ) : (
          <EditItemGroupInput
            plan={plan}
            editTarget={editTarget}
            setEditTarget={setEditTarget}
          />
        )}
      </ScreenView>
    );
  }
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
