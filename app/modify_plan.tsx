import { plansState } from "@/atoms/plansAtom";
import { userState } from "@/atoms/userAtom";
import Header from "@/components/Header";
import ModifyMemberView from "@/components/ModifyMemberView";
import ScreenView from "@/components/ScreenView";
import { firestoreUpdatePlan } from "@/utils/api";
import { Plan } from "@/utils/types";
import { param2string } from "@/utils/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";

import { useRecoilValue } from "recoil";

export default function ModifyPlanScreen() {
  const { index: paramIndex } = useLocalSearchParams();
  const index = parseInt(param2string(paramIndex));
  const plans = useRecoilValue(plansState);
  const plan = plans[index];
  const user = useRecoilValue(userState);

  const [title, setTitle] = useState(plan.title);
  const [planUsers, setPlanUsers] = useState(plan.planUsers);
  const [invitedPlanUsers, setInvitedPlanUsers] = useState(
    plan.invitedPlanUsers
  );

  const modifyPlan = async () => {
    // Check isAdmin
    const foundUser = plan.planUsers.find(
      (planUser) => planUser.uid === user.uid
    );
    if (foundUser && !foundUser.isAdmin) {
      console.log("Don't have admin");
      return;
    }

    // Check minimum admin
    const hasAdminUser = plan.planUsers.some((planUser) => planUser.isAdmin);
    if (!hasAdminUser) {
      console.log("At least one admin must exist.");
      return;
    }

    await firestoreUpdatePlan(plan, title, planUsers, invitedPlanUsers);
    router.back();
  };

  return (
    <ScreenView>
      <Header title="ModifyPlan" enableBackAction />
      <View>
        <Text>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="title"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="none" // 자동 대문자 막기
        />
      </View>
      <ModifyMemberView
        planUsers={planUsers}
        setPlanUsers={setPlanUsers}
        invitedPlanUsers={invitedPlanUsers}
        setInvitedPlanUsers={setInvitedPlanUsers}
      />
      <View style={styles.buttonContainer}>
        <Button title="Modify Plan" onPress={modifyPlan} />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 5,
    marginHorizontal: 8,
  },
});
