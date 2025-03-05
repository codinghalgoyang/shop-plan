import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import { firestoreDenyPlan, firestoreJoinPlan } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { User } from "@/utils/types";
import { StyleSheet, View } from "react-native";
import { useRecoilValue } from "recoil";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import Paper from "../Common/Paper";
import HomePlanTitle from "./HomePlanTitle";

interface HomeInvitedPlanViewProps {
  index: number;
  user: User;
}

export default function HomeInvitedPlanView({
  index,
  user,
}: HomeInvitedPlanViewProps) {
  const invitedPlans = useRecoilValue(invitedPlansState);
  const invitedPlan = invitedPlans[index];
  if (!user) return null;

  const join = async () => {
    await firestoreJoinPlan(user, invitedPlan);
  };
  const deny = async () => {
    await firestoreDenyPlan(user, invitedPlan);
  };

  return (
    <Paper style={styles.container}>
      <View style={styles.header}>
        <HomePlanTitle
          title={invitedPlan.title || "Loading..."}
          users={invitedPlan?.planUsers}
        />
        <View style={styles.buttonContainer}>
          <ThemedTextButton onPress={join}>수락</ThemedTextButton>
          <ThemedTextButton onPress={deny} type="outline">
            거절
          </ThemedTextButton>
        </View>
      </View>
    </Paper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 5,
  },
});
