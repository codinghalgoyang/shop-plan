import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import { firestoreDenyPlan, firestoreJoinPlan } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { User } from "@/utils/types";
import { StyleSheet, View } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import Paper from "../Common/Paper";
import HomePlanTitle from "./HomePlanTitle";
import { modalState } from "@/atoms/modalAtom";

interface HomeInvitedPlanViewProps {
  index: number;
  user: User;
}

export default function HomeInvitedPlanView({
  index,
  user,
}: HomeInvitedPlanViewProps) {
  const setModal = useSetRecoilState(modalState);
  const invitedPlans = useRecoilValue(invitedPlansState);
  const invitedPlan = invitedPlans[index];
  if (!user) return null;

  const join = async () => {
    const result = await firestoreJoinPlan(user, invitedPlan);
    if (!result) {
      setModal({
        visible: true,
        message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
      });
    }
  };

  const deny = async () => {
    const result = await firestoreDenyPlan(user, invitedPlan);
    if (!result) {
      setModal({
        visible: true,
        message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
      });
    }
  };

  return (
    <Paper style={styles.container}>
      <View style={styles.header}>
        <HomePlanTitle
          title={invitedPlan.title || "Loading..."}
          users={invitedPlan?.planUsers}
        />
        <View style={styles.buttonContainer}>
          <ThemedTextButton onPress={join} color="blue">
            수락
          </ThemedTextButton>
          <ThemedTextButton onPress={deny} color="gray">
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
