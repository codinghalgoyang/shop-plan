import { plansState } from "@/atoms/plansAtom";
import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { firestoreRemovePlan, firestoreUpdatePlan } from "@/utils/api";
import { Plan, PlanUser } from "@/utils/types";
import { param2string } from "@/utils/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";

import { useRecoilValue } from "recoil";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import { Colors } from "@/utils/Colors";
import ThemedTextInput from "@/components/Common/ThemedTextInput";
import Paper from "@/components/Common/Paper";
import EditPlanMembersView from "@/components/EditPlan/EditPlanMembersView";

export default function EditPlanScreen() {
  const { index: paramIndex } = useLocalSearchParams();
  const index = parseInt(param2string(paramIndex));
  const plans = useRecoilValue(plansState);
  const plan = plans[index];
  const [title, setTitle] = useState(plan.title);
  const user = useRecoilValue(userState);
  const myPlanUser = plan.planUsers.find(
    (planUser) => planUser.uid === user.uid
  ) ?? { uid: "", username: "Unknown user", isAdmin: false };
  const editable = myPlanUser?.isAdmin;

  const changeTitle = async () => {
    const newPlan: Plan = { ...plan };
    newPlan.title = title;
    await firestoreUpdatePlan(newPlan);
    console.log("Change the title : ", title);
  };
  const removePlan = async () => {
    if (!myPlanUser.isAdmin) {
      console.log("Only admin can remove Plan");
      return;
    }
    firestoreRemovePlan(plan.id);
    router.back();
  };

  const withdrawPlan = async () => {
    // 나 혼자만 있을 때
    if (plan.planUserUids.length == 1) {
      firestoreRemovePlan(plan.id);
      router.back();
    } else {
      const myPlanUserIndex = plan.planUserUids.findIndex(
        (uid) => uid === myPlanUser.uid
      );

      console.log("myPlanUserIndex : ", myPlanUserIndex);

      const newPlanUserUids: string[] = plan.planUserUids.filter(
        (_, idx) => idx != myPlanUserIndex
      );
      const newPlanUsers: PlanUser[] = plan.planUsers.filter(
        (_, idx) => idx != myPlanUserIndex
      );

      const adminCount = newPlanUsers.filter(
        (planUser) => planUser.isAdmin
      ).length;

      if (adminCount == 0) {
        console.log("최소한 admin이 한 명은 있어야 합니다.");
        return;
      }

      const newPlan: Plan = { ...plan };
      newPlan.planUserUids = newPlanUserUids;
      newPlan.planUsers = newPlanUsers;
      firestoreUpdatePlan(newPlan);
      router.back();
    }
  };

  return (
    <ScreenView>
      <Header title="플랜 수정" enableBackAction />
      <View style={styles.container}>
        <ThemedText>플랜 제목</ThemedText>
        <View style={styles.titleContainer}>
          <ThemedTextInput
            placeholder="플랜 제목"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="none" // 자동 대문자 막기
            editable={editable}
            style={styles.input}
          />
          {editable && (
            <ThemedTextButton
              disabled={title == plan.title || title == ""}
              onPress={changeTitle}
              color={title == plan.title || title == "" ? "gray" : "blue"}
              type="fill"
            >
              변경
            </ThemedTextButton>
          )}
        </View>
        <ThemedText>사용자</ThemedText>
        <EditPlanMembersView plan={plan} />
        <View style={styles.buttonContainer}>
          <ThemedTextButton
            onPress={withdrawPlan}
            buttonStyle={styles.button}
            weight="bold"
            color="orange"
            type="fill"
          >
            플랜 나가기
          </ThemedTextButton>
          {myPlanUser.isAdmin && (
            <ThemedTextButton
              onPress={removePlan}
              buttonStyle={styles.button}
              color="orange"
              weight="bold"
              type="outline"
            >
              플랜 삭제하기
            </ThemedTextButton>
          )}
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.lightGray,
    padding: 12,
    gap: 12,
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  input: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 12,
    gap: 8,
  },
  button: {
    width: "100%",
  },
});
