import { plansState } from "@/atoms/plansAtom";
import { userState } from "@/atoms/userAtom";
import Header from "@/components/Header";
import ModifyPlanMembersView from "@/components/ModifyPlan/ModifyPlanMembersView";
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
  const [title, setTitle] = useState(plan.title);
  const user = useRecoilValue(userState);
  const planUser = plan.planUsers.find((planUser) => planUser.uid === user.uid);
  const editable = planUser?.isAdmin;

  const changeTitle = async () => {
    const newPlan: Plan = { ...plan };
    newPlan.title = title;
    await firestoreUpdatePlan(newPlan);
    console.log("Change the title : ", title);
  };

  return (
    <ScreenView>
      <Header title="ModifyPlan" enableBackAction />
      <View>
        <Text>Title</Text>
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
            <Button
              title="변경"
              disabled={title === plan.title}
              onPress={changeTitle}
            />
          )}
        </View>
      </View>
      <ModifyPlanMembersView plan={plan} />
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
