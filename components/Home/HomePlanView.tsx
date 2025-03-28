import { plansState } from "@/atoms/plansAtom";
import { router } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { Colors } from "@/utils/Colors";
import { Bar } from "react-native-progress";
import Paper from "../Common/Paper";
import HomePlanTitle from "./HomePlanTitle";

interface HomePlanViewProps {
  planId: string;
}

export default function HomePlanView({ planId }: HomePlanViewProps) {
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  if (plan === undefined) {
    return null;
  }
  const progress =
    plan.items.length == 0
      ? 0
      : plan.items.filter((item) => item.checked).length / plan.items.length;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/plan?plan_id=${planId}`);
      }}
    >
      <Paper style={styles.container}>
        <View style={styles.header}>
          <HomePlanTitle
            title={plan.title || "Loading..."}
            users={plan?.planUsers}
            planId={planId}
          />
        </View>
        <Bar
          progress={progress}
          color={Colors.orange}
          width={null}
          borderWidth={0}
          unfilledColor={Colors.border}
        />
      </Paper>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
