import { plansState } from "@/atoms/plansAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import EditItemFlatList from "@/components/EditItem/EditItemFlatList";
import EditItemInput from "@/components/EditItem/EditItemInput";
import { findItem, param2string } from "@/utils/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function EditItemScreen() {
  const { plan_id: planId, item_id: editingItemId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  const editingItem = findItem(plan, param2string(editingItemId));

  useEffect(() => {
    if (!plan) {
      router.back();
      return;
    }
  }, [plan]);

  if (!plan || !editingItem) {
    return null;
  }

  return (
    <ScreenView>
      <Header title={`항목 수정`} color="orange" enableBackAction />
      <EditItemFlatList plan={plan} editingItem={editingItem} />
      <EditItemInput plan={plan} editingItem={editingItem} />
    </ScreenView>
  );
}
