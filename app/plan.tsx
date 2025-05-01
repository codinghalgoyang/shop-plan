import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { BackHandler, StyleSheet, View } from "react-native";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";
import { useEffect, useState } from "react";
import PlanHeader from "@/components/Plan/PlanHeader";
import AddItemInput from "@/components/Plan/AddItemInput";
import { findDefaultItemGroupId, findItemGroup } from "@/utils/utils";
import { scrollTargetState } from "@/atoms/scrollTargetAtom";
import PlanFlatList from "@/components/Plan/PlanFlatList";
import { editTargetState } from "@/atoms/editTargetAtom";
import EditItemGroupInput from "@/components/Plan/EditItemGroupInput";
import EditItemInput from "@/components/Plan/EditItemInput";
import NativeAdComponent from "@/components/Plan/NativeAdComponent";

export type Target = {
  type: "ITEM_GROUP" | "ITEM";
  itemGroupId: string;
  itemId: string | null;
} | null;

// TODO: 정리, ItemGroup으로 직접넣으니, 누군가 ItemGroups를 수정했을때, 이것도 다시 업데이트 해줘야하는 문제가 생긴다. id를 가지고 하자
export type ActivatedItemGroupId = string | null;

export type AddItemInputMode = "ITEM" | "CATEGORY" | "LINK";

export default function PlanScreen() {
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  const setting = useRecoilValue(settingState);
  const [editTarget, setEditTarget] = useRecoilState(editTargetState);
  const setScrollTarget = useSetRecoilState(scrollTargetState);
  const [activatedItemGroupId, setActivatedItemGroupId] =
    useState<ActivatedItemGroupId>(null);
  const [addItemInputMode, setAddItemInputMode] =
    useState<AddItemInputMode>("ITEM");

  // TODO : 이걸 useEffect로 빼면 에러가나네. 왜그럴까?
  if (setting.aodEnabled) {
    useKeepAwake();
  }

  useEffect(() => {
    if (!plan) {
      router.back();
      return;
    }
    setEditTarget(null);
    setScrollTarget(null);
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
  }
  return (
    <ScreenView>
      <PlanHeader plan={plan} />
      <NativeAdComponent visible={!editTarget ? true : false} />
      <View style={styles.container}>
        <PlanFlatList
          plan={plan}
          activatedItemGroupId={activatedItemGroupId}
          setActivatedItemGroupId={setActivatedItemGroupId}
          addItemInputMode={addItemInputMode}
          setAddItemInputMode={setAddItemInputMode}
        />
      </View>
      {!editTarget ? (
        <AddItemInput
          plan={plan}
          activatedItemGroupId={activatedItemGroupId}
          setActivatedItemGroupId={setActivatedItemGroupId}
          inputMode={addItemInputMode}
          setInputMode={setAddItemInputMode}
        />
      ) : editTarget.type === "ITEM_GROUP" ? (
        <EditItemGroupInput plan={plan} />
      ) : (
        <EditItemInput plan={plan} />
      )}
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
