import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import { router } from "expo-router";
import { userState } from "@/atoms/userAtom";
import { firestoreAddPlan } from "@/utils/api";
import AddPlanMembersView from "@/components/AddPlan/AddPlanMembersView";

export default function AddPlanScreen() {
  const user = useRecoilValue(userState);
  const [title, setTitle] = useState("");
  const [invitedPlanUsers, setInvitedPlanUsers] = useState<InvitedPlanUser[]>(
    []
  );
  const planUsers: PlanUser[] = [
    { uid: user.uid, username: user.username, isAdmin: true },
  ];

  const addPlan = async () => {
    if (!user) return;
    if (!title) {
      console.log("error! need to fill title");
      return;
    }

    await firestoreAddPlan(title, planUsers, invitedPlanUsers);
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
      <AddPlanMembersView
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
