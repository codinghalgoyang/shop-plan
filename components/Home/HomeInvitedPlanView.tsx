import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import { firestoreDenyPlan, firestoreJoinPlan } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { User } from "@/utils/types";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";
import ThemedText from "../Common/ThemedText";

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
    <View style={styles.container}>
      <View style={styles.titleUserContainer}>
        <ThemedText style={styles.title}>
          {invitedPlan.title || "Loading..."}
        </ThemedText>
        <View style={styles.usersContainer}>
          <ThemedText style={styles.userName}>with</ThemedText>
          {invitedPlan?.planUsers.map((planUser) => (
            <ThemedText key={planUser.uid} style={styles.userName}>
              {planUser.username}
            </ThemedText>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={join}
          style={[styles.button, styles.joinButton]}
        >
          <ThemedText style={styles.joinButtonText}>가입</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={deny}
          style={[styles.button, styles.denyButton]}
        >
          <ThemedText style={styles.denyButtonText}>거절</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleUserContainer: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
  },
  usersContainer: {
    flexDirection: "row",
    gap: 5,
  },
  userName: {
    color: Colors.content.disabled,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 5,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  joinButton: {
    backgroundColor: Colors.primary,
  },
  joinButtonText: {
    color: Colors.content.white,
    fontWeight: 600,
  },
  denyButton: {
    backgroundColor: Colors.content.disabled,
  },
  denyButtonText: {
    color: Colors.content.white,
    fontWeight: 600,
  },
});
