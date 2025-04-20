import { plansState } from "@/atoms/plansAtom";
import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function EditItemScreen() {
  const {
    plan_id: planId,
    type: type,
    item_group_id: itemGroupId,
    item_id: itemId,
  } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);

  useEffect(() => {
    if (!plan) {
      router.back();
      return;
    }
  }, [plan]);

  if (!plan) {
    return null;
  } else {
    return (
      <ScreenView>
        <PlanHeader
          plan={plan}
          editTarget={editTarget}
          setEditTarget={setEditTarget}
        />
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
            setScrollTarget={setScrollTarget}
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
