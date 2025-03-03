import { plansState } from "@/atoms/plansAtom";
import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import ModifyPlanMembersView from "@/components/ModifyPlan/ModifyPlanMembersView";
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

export default function ModifyPlanScreen() {
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
      <Header title="ModifyPlan" enableBackAction />
      <View>
        <ThemedText>Title</ThemedText>
        <View style={styles.titleInputContainer}>
          <TextInput
            style={[
              styles.input,
              { color: editable ? "black" : "gray" },
              { borderWidth: editable ? 1 : 0 },
            ]}
            placeholder="title"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="none" // 자동 대문자 막기
            editable={editable}
          />
          {editable && (
            <ThemedTextButton
              disabled={title == plan.title}
              onPress={changeTitle}
            >
              변경
            </ThemedTextButton>
          )}
        </View>
      </View>
      <ModifyPlanMembersView plan={plan} />
      <ThemedTextButton onPress={withdrawPlan}>Plan 나가기</ThemedTextButton>
      <ThemedTextButton disabled={!myPlanUser.isAdmin} onPress={removePlan}>
        Plan 삭제
      </ThemedTextButton>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 24,
    marginBottom: 12,
    paddingHorizontal: 8,
    flex: 1,
  },
  titleInputContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 5,
    marginHorizontal: 8,
  },
});
