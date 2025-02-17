import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import { firestoreDenyPlan, firestoreJoinPlan } from "@/utils/api";
import { User } from "@/utils/types";
import { StyleSheet, View, Text, Button } from "react-native";
import { useRecoilValue } from "recoil";

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
        <Text style={styles.title}>{invitedPlan.title || "Loading..."}</Text>
        <View style={styles.usernameContainer}>
          {invitedPlan?.planUsers.map((planUser) => (
            <Text key={planUser.uid} style={styles.users}>
              {planUser.username}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="join" onPress={join} />
        <Button title="deny" onPress={deny} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderWidth: 1, // 테두리 두께
    borderColor: "black", // 테두리 색상
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  usersContainer: {
    flexDirection: "row",
    gap: 5,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  title: {
    fontSize: 24,
  },
  users: {
    fontSize: 18,
  },
});
