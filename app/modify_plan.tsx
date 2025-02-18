import { plansState } from "@/atoms/plansAtom";
import { userState } from "@/atoms/userAtom";
import Header from "@/components/Header";
import ModifyPlanMembersView from "@/components/ModifyPlan/ModifyPlanMembersView";
import ScreenView from "@/components/ScreenView";
import { firestoreUpdatePlan } from "@/utils/api";
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
  const [title, setTitle] = useState(plan.title);
  const user = useRecoilValue(userState);
  const planUser = plan.planUsers.find((planUser) => planUser.uid === user.uid);

  return (
    <ScreenView>
      <Header title="ModifyPlan" enableBackAction />
      <View>
        <Text>Title</Text>
        <TextInput
          style={[
            styles.input,
            { color: planUser?.isAdmin ? "black" : "gray" },
            { borderWidth: planUser?.isAdmin ? 1 : 0 },
          ]}
          placeholder="title"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="none" // 자동 대문자 막기
          editable={planUser?.isAdmin}
        />
      </View>
      <ModifyPlanMembersView plan={plan} />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    fontSize: 24,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    marginTop: 5,
    marginHorizontal: 8,
  },
});
