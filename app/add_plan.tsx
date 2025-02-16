import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { InvitedPlanUser, Plan, PlanUser } from "@/utils/types";
import { router } from "expo-router";
import ModifyMemberView from "@/components/ModifyMemberView";
import { userState } from "@/atoms/userAtom";
import { firestoreAddPlan } from "@/utils/api";

export default function AddPlanScreen() {
  const [user, setUser] = useRecoilState(userState);
  const [title, setTitle] = useState("");
  const [planUserUids, setPlanUserUids] = useState<string[]>([]);
  const [planUsers, setPlanUsers] = useState<PlanUser[]>([]);
  const [invitedPlanUsers, setInvitedPlanUsers] = useState<InvitedPlanUser[]>(
    []
  );

  useEffect(() => {
    if (!user) return;
    setPlanUserUids([user.uid]);
    setPlanUsers([{ uid: user.uid, username: user.username, isAdmin: true }]);
  }, []);

  const addPlan = async () => {
    if (!user) return;
    await firestoreAddPlan(title, planUserUids, planUsers, invitedPlanUsers);
    router.back();
  };

  return (
    <ScreenView>
      <Header title="AddPlan" enableBackAction />
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
        invitedPlanUsers={invitedPlanUsers}
        setInvitedPlanUsers={setInvitedPlanUsers}
      />
      <View style={styles.buttonContainer}>
        <Button title="Add Plan" onPress={addPlan} />
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
