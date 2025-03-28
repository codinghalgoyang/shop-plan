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
    try {
      await firestoreJoinPlan(user, invitedPlan);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const deny = async () => {
    try {
      await firestoreDenyPlan(user, invitedPlan);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
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
    borderWidth: 1,
    borderColor: Colors.border,
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
