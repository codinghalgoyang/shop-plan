import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import { StyleSheet, View, Text } from "react-native";
import { useRecoilValue } from "recoil";

interface HomeInvitedPlanViewProps {
  index: number;
}

export default function HomeInvitedPlanView({
  index,
}: HomeInvitedPlanViewProps) {
  const invitedPlans = useRecoilValue(invitedPlansState);
  const invitedPlan = invitedPlans[index];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{invitedPlan.title || "Loading..."}</Text>
      {invitedPlan?.planUsers.map((planUser) => (
        <Text key={planUser.uid} style={styles.users}>
          {planUser.username}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderWidth: 1, // 테두리 두께
    borderColor: "black", // 테두리 색상
    padding: 10,
  },
  title: {
    fontSize: 24,
  },
  users: {
    fontSize: 18,
  },
});
