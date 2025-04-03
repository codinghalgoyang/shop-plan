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
  const [category, setCategory] = useState("");
  const [extraEnabled, setExtraEnabled] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const isEditing = editItemIdx !== -1;

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
          setCategory={setCategory}
          extraEnabled={extraEnabled}
          setExtraEnabled={setExtraEnabled}
          isEditing={isEditing}
        />
      </View>
      {isDeleteMode ? (
        <PlanItemDeleteButtonView plan={plan} />
      ) : isEditing ? (
        <PlanItemEdit
          plan={plan}
          itemIdx={editItemIdx}
          setEditItemIdx={setEditItemIdx}
          category={category}
          setCategory={setCategory}
          extraEnabled={extraEnabled}
          setExtraEnabled={setExtraEnabled}
        />
      ) : (
        <PlanItemInput
          plan={plan}
          category={category}
          setCategory={setCategory}
          extraEnabled={extraEnabled}
          setExtraEnabled={setExtraEnabled}
        />
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
