import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import PlanItemView from "@/components/Plan/PlanItemView";
import PlanInput from "@/components/Plan/PlanInput";
import { param2string } from "@/utils/utils";
import { useRecoilValue } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";

export default function PlanScreen() {
  const { index: paramIndex } = useLocalSearchParams();
  const index = parseInt(param2string(paramIndex));
  const plans = useRecoilValue(plansState);
  const plan = plans[index];
  const setting = useRecoilValue(settingState);

  if (setting.aodEnabled) {
    console.log("aod on");
    useKeepAwake();
  } else {
    console.log("aod off");
  }

  return (
    <ScreenView>
      <Header title={plan ? plan.title : "Loading..."} enableBackAction />
      <View style={styles.container}>
        <ScrollView style={styles.listContainer}>
          {plan?.items.map((planItem, itemIdx) => (
            <PlanItemView key={planItem.title} plan={plan} itemIdx={itemIdx} />
          ))}
        </ScrollView>
        <PlanInput plan={plan} />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
});
