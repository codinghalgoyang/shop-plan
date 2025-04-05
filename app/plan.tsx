import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
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
import { Item, ItemGroup } from "@/utils/types";

export type PlanScreenMode = "ADD_ITEM" | "EDIT" | "DELETE";
export type PlanScreenEditTarget = ItemGroup | Item | null;

export default function PlanScreen() {
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  const [] = useState<PlanScreenMode>();
  const setting = useRecoilValue(settingState);
  const [planScreenMode, setPlanScreenMode] =
    useState<PlanScreenMode>("ADD_ITEM");
  const [editTarget, setEditTarget] = useState<PlanScreenEditTarget>(null);
  const [addItemTargetItemGroup, setAddItemTargetItemGroup] =
    useState<ItemGroup | null>(null);

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
    const defaultAddItemTargetItemGroup = plan?.itemGroups.find(
      (itemGroup) => itemGroup.category == ""
    );
    if (defaultAddItemTargetItemGroup) {
      setAddItemTargetItemGroup(defaultAddItemTargetItemGroup);
    } else {
      throw new Error("Can't find defaultAddItemTargetItemGroup");
    }
  }, []);

  if (!plan) {
    return null;
  } else {
    function isItemGroupType(editTarget: any) {
      throw new Error("Function not implemented.");
    }

    function isItemType(editTarget: any) {
      throw new Error("Function not implemented.");
    }

    return (
      <ScreenView>
        <PlanHeader
          plan={plan}
          planScreenMode={planScreenMode}
          setPlanScreenMode={setPlanScreenMode}
        />
        <View style={styles.container}>
          {planScreenMode == "ADD_ITEM" && <PlanCoupangButton />}
          <PlanItemsView plan={plan} planScreenMode={planScreenMode} />
        </View>
        {planScreenMode == "ADD_ITEM" ? (
          <AddItemInput
            plan={plan}
            targetItemGroup={addItemTargetItemGroup}
            setTargetItemGroup={setAddItemTargetItemGroup}
          />
        ) : planScreenMode == "EDIT" && isItemGroupType(editTarget) ? (
          <EditItemGroupInput />
        ) : planScreenMode == "EDIT" && isItemType(editTarget) ? (
          <EditItemInput />
        ) : (
          <PlanItemDeleteButtonView
            plan={plan}
            setPlanScreenMode={setPlanScreenMode}
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
