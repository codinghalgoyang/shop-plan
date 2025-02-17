import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import { User } from "@react-native-google-signin/google-signin/lib/typescript/src/types";
import { StyleSheet, View, Text, Button } from "react-native";
import { useRecoilValue } from "recoil";

interface HomeInvitedPlanViewProps {
  index: number;
  user: User,
}

export default function HomeInvitedPlanView({
  index,
}: HomeInvitedPlanViewProps) {
  const invitedPlans = useRecoilValue(invitedPlansState);
  const invitedPlan = invitedPlans[index];

  const join = async () => {};
  const deny = async () => {};

  return (
    <View style={styles.container}>
      <View style={styles.titleUserContainer}>
        <Text style={styles.title}>{invitedPlan.title || "Loading..."}</Text>
        {invitedPlan?.planUsers.map((planUser) => (
          <Text key={planUser.uid} style={styles.users}>
            {planUser.username}
          </Text>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="join" />
        <Button title="deny" />
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
  titleUserContainer: {},
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
