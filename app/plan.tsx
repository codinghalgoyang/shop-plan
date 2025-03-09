import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import PlanItemView from "@/components/Plan/PlanItemView";
import { param2string } from "@/utils/utils";
import { useRecoilValue } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";
import PlanItemInput from "@/components/Plan/PlanItemInput";
import { Plan, PlanItem, PlanItemIndexPair } from "@/utils/types";
import ThemedText from "@/components/Common/ThemedText";
import Paper from "@/components/Common/Paper";

function getCategories(plan: Plan) {
  const allCategories = plan?.items.map((item) => item.category);
  const uniqueCategories = [...new Set(allCategories)];
  if (uniqueCategories.includes("")) {
    const categories = uniqueCategories.filter((category) => category !== ""); // remove ""
    categories.push(""); // add "" at the end
    return categories;
  } else {
    return uniqueCategories;
  }
}

export default function PlanScreen() {
  const { index: paramIndex } = useLocalSearchParams();
  const index = parseInt(param2string(paramIndex));
  const plans = useRecoilValue(plansState);
  const plan = plans[index];
  const setting = useRecoilValue(settingState);
  const categories = getCategories(plan);
  const planItemIndexPairs: PlanItemIndexPair[] = plan?.items.map(
    (planItem, index) => {
      return { planItem, index };
    }
  );

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
        <ScrollView contentContainerStyle={{ gap: 8 }}>
          {categories.map((category) => {
            return (
              <View key={category} style={{ gap: 8 }}>
                <ThemedText
                  size="small"
                  color="gray"
                  style={{ marginLeft: 12 }}
                >
                  {categories.length == 1
                    ? "구매 항목"
                    : category == ""
                    ? "분류 없음"
                    : category}
                </ThemedText>
                <Paper>
                  {plan?.items.map((planItem, itemIdx) => {
                    if (planItem.checked) return null;
                    if (planItem.category !== category) return null;
                    return (
                      <PlanItemView
                        key={planItem.title}
                        plan={plan}
                        itemIdx={itemIdx}
                        isFirstItem={itemIdx == 0}
                      />
                    );
                  })}
                  {plan?.items.map((planItem, itemIdx) => {
                    if (!planItem.checked) return null;
                    if (planItem.category !== category) return null;
                    return (
                      <PlanItemView
                        key={planItem.title}
                        plan={plan}
                        itemIdx={itemIdx}
                      />
                    );
                  })}
                </Paper>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <PlanItemInput plan={plan} />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingVertical: 8,
  },
});
