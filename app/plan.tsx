import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";
import { useEffect } from "react";
import PlanHeader from "@/components/Plan/PlanHeader";
import PlanCoupangButton from "@/components/Plan/PlanCoupanButton";
import PlanItemsView from "@/components/Plan/PlanItemsView";
import PlanItemDeleteButtonView from "@/components/Plan/PlanItemDeleteButtonView";
import PlanInput from "@/components/Plan/PlanInput";
import { planViewStatusState } from "@/atoms/planViewStatusAtom";

export default function PlanScreen() {
  const [planViewStatus, setPlanViewStatus] =
    useRecoilState(planViewStatusState);
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  if (plan === undefined) {
    router.back();
    return null;
  }

  const setting = useRecoilValue(settingState);

  // TODO : 이걸 useEffect로 빼면 에러가나네. 왜그럴까?
  if (setting.aodEnabled) {
    useKeepAwake();
  }

  useEffect(() => {
    // TODO : category 삭제시 이동 필요, category 삭제시 최소 하나는 남겨야함.
    // planViewStatus 초기화

    if (
      planViewStatus.activatedItemGroupId == "" ||
      !plan.itemGroups.find(
        (itemGroup) => itemGroup.id == planViewStatus.activatedItemGroupId
      )
    ) {
      setPlanViewStatus((prev) => {
        return {
          ...prev,
          activatedItemGroupId: plan.itemGroups[0].id,
        };
      });
    }
  }, [plan.itemGroups, planViewStatus.activatedItemGroupId]);

  if (planViewStatus.activatedItemGroupId == "") {
    return null;
  } else {
    return (
      <ScreenView>
        <PlanHeader plan={plan} />
        <View style={styles.container}>
          <PlanCoupangButton />
          <PlanItemsView plan={plan} />
        </View>
        {planViewStatus.planViewMode == "DELETE" ? (
          <PlanItemDeleteButtonView plan={plan} />
        ) : (
          <PlanInput plan={plan} />
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
