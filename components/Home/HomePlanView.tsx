import { plansState } from "@/atoms/plansAtom";
import { router } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import { Colors } from "@/utils/Colors";
import { Bar } from "react-native-progress";
import Paper from "../Common/Paper";
import HomePlanTitle from "./HomePlanTitle";
import ThemedTextButton from "../Common/ThemedTextButton";

interface HomePlanViewProps {
  index: number;
}

export default function HomePlanView({ index }: HomePlanViewProps) {
  const plans = useRecoilValue(plansState);
  const plan = plans[index];
  const progress =
    plan.items.length == 0
      ? 0
      : plan.items.filter((item) => item.checked).length / plan.items.length;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/plan?index=${index}`);
      }}
    >
      <Paper style={styles.container}>
        <View style={styles.header}>
          <HomePlanTitle
            title={plan.title || "Loading..."}
            users={plan?.planUsers}
          />
          <ThemedTextButton
            size="small"
            color="gray"
            buttonStyle={styles.editButton}
            onPress={() => {
              router.push(`/edit_plan?index=${index}`);
            }}
          >
            편집
          </ThemedTextButton>
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
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editButton: {
    marginTop: -24,
    marginRight: -8,
  },
});
