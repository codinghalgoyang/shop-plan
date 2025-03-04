import { plansState } from "@/atoms/plansAtom";
import { router } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import Octicons from "@expo/vector-icons/Octicons";
import { Colors } from "@/utils/Colors";
import { Bar } from "react-native-progress";
import ThemedIcon from "../Common/ThemedIcon";
import Paper from "../Common/Paper";
import HomePlanTitle from "./HomePlanTitle";

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
          <ThemedIcon
            IconComponent={Octicons}
            iconName="pencil"
            onPress={() => {
              router.push(`/modify_plan?index=${index}`);
            }}
            style={styles.modifyButton}
            padding
            size="big"
          />
        </View>

        <Bar
          progress={0.5}
          color={Colors.primary}
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
    marginBottom: 12,
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
  modifyButton: {
    marginRight: -8,
    marginTop: -12,
  },
});
