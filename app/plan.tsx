import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useRecoilValue } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";
import PlanItemInput from "@/components/Plan/PlanItemInput";
import { useState } from "react";
import PlanItemEdit from "@/components/Plan/PlanItemEdit";
import PlanHeader from "@/components/Plan/PlanHeader";
import PlanCoupangButton from "@/components/Plan/PlanCoupanButton";
import PlanItemsView from "@/components/Plan/PlanItemsView";
import PlanItemDeleteButtonView from "@/components/Plan/PlanItemDeleteButtonView";

export default function PlanScreen() {
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  if (plan === undefined) {
    router.back();
    return null;
  }
  const setting = useRecoilValue(settingState);
  const [editItemIdx, setEditItemIdx] = useState(-1);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // TODO : 이걸 useEffect로 빼면 에러가나네. 왜그럴까?
  if (setting.aodEnabled) {
    useKeepAwake();
  }

  return (
    <ScreenView>
      <PlanHeader
        plan={plan}
        isDeleteMode={isDeleteMode}
        setIsDeleteMode={setIsDeleteMode}
      />
      <View style={styles.container}>
        {!isDeleteMode && <PlanCoupangButton />}
        <PlanItemsView
          plan={plan}
          editItemIdx={editItemIdx}
          setEditItemIdx={setEditItemIdx}
          isDeleteMode={isDeleteMode}
        />
      </View>
      {isDeleteMode ? (
        <PlanItemDeleteButtonView plan={plan} />
      ) : editItemIdx !== -1 ? (
        <PlanItemEdit
          plan={plan}
          itemIdx={editItemIdx}
          setEditItemIdx={setEditItemIdx}
        />
      ) : (
        <PlanItemInput plan={plan} />
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
