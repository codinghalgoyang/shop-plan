import { plansState } from "@/atoms/plansAtom";
import { router } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Colors } from "@/utils/Colors";
import { Bar } from "react-native-progress";
import ThemedIcon from "../Common/ThemedIcon";
import Paper from "../Common/Paper";
import HomePlanTitle from "./HomePlanTitle";
import ThemedTextButton from "../Common/ThemedTextButton";
import ThemedText from "../Common/ThemedText";

interface HomePlanViewProps {
  index: number;
}

export default function HomePlanView({ index }: HomePlanViewProps) {
  const plans = useRecoilValue(plansState);
  const plan = plans[index];

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
          progress={0.5}
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
