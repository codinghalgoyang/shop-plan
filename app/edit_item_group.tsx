import { plansState } from "@/atoms/plansAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import EditItemGroupFlatList from "@/components/EditItemGroup/EditItemGroupFlatList";
import EditItemGroupInput from "@/components/EditItemGroup/EditItemGroupInput";
import { findItemGroup, param2string } from "@/utils/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function EditItemGroupScreen() {
  const { plan_id: planId, item_group_id: editingItemGroupId } =
    useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  const editingItemGroup = findItemGroup(
    plan,
    param2string(editingItemGroupId)
  );

  useEffect(() => {
    if (!plan) {
      router.back();
      return;
    }
  }, [plan]);

  if (!plan || !editingItemGroup) {
    return null;
  }

  return (
    <ScreenView>
      <Header title={`카테고리 수정`} color="orange" enableBackAction />
      <EditItemGroupFlatList plan={plan} editingItemGroup={editingItemGroup} />
      <EditItemGroupInput plan={plan} editingItemGroup={editingItemGroup} />
    </ScreenView>
  );
}
