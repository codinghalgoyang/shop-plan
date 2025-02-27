import { View, ScrollView, StyleSheet, TextInput, Button } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { InvitedPlanUser, Plan, PlanUser } from "@/utils/types";
import {
  firestoreFindUser,
  firestoreRemovePlan,
  firestoreUpdatePlan,
} from "@/utils/api";
import { defaultUser, userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import ModifyPlanMemberView from "./ModifyPlanMemberView";
import { router } from "expo-router";
import ThemedText from "../Common/ThemedText";

interface ModifyMemberViewProps {
  plan: Plan;
}

export default function ModifyPlanMembersView({ plan }: ModifyMemberViewProps) {
  const user = useRecoilValue(userState);
  const myPlanUser: PlanUser = plan.planUsers.find(
    (planUser) => planUser.uid == user.uid
  ) ?? { uid: "", username: "Unknown user", isAdmin: false };
  const [newUsername, setNewUsername] = useState("");

  const removePlanUser = async (index: number) => {
    if (!myPlanUser.isAdmin) {
      console.log("Only admin can change Admin!");
      return;
    }

    const newPlanUserUids: string[] = plan.planUserUids.filter(
      (_, idx) => idx != index
    );
    const newPlanUsers: PlanUser[] = plan.planUsers.filter(
      (_, idx) => idx != index
    );

    const adminCount = newPlanUsers.filter(
      (planUser) => planUser.isAdmin
    ).length;

    if (adminCount == 0) {
      console.log("최소한 admin이 한 명은 있어야 합니다.");
    }

    const newPlan: Plan = { ...plan };
    newPlan.planUserUids = newPlanUserUids;
    newPlan.planUsers = newPlanUsers;
    await firestoreUpdatePlan(newPlan);
  };

  const addInvitedPlanUser = async () => {
    const newUser = await firestoreFindUser(newUsername);
    console.log("newUser : ", newUser);
    setNewUsername("");
    if (newUser) {
      const newPlan: Plan = { ...plan };
      newPlan.invitedPlanUserUids = [
        ...newPlan.invitedPlanUserUids,
        newUser.uid,
      ];
      newPlan.invitedPlanUsers = [...newPlan.invitedPlanUsers, newUser];
      await firestoreUpdatePlan(newPlan);
    } else {
      console.log("can't find username : ", newUsername);
    }
  };

  const removeInvitedPlanUser = async (index: number) => {
    if (!myPlanUser.isAdmin) {
      console.log("Only admin can change Admin!");
      return;
    }

    const newInvitedPlanUserUids: string[] = plan.invitedPlanUserUids.filter(
      (nvitedPlanUserUid, idx) => idx != index
    );
    const newInvitedPlanUsers: InvitedPlanUser[] = plan.invitedPlanUsers.filter(
      (invitedPlanUser, idx) => idx != index
    );

    const newPlan: Plan = { ...plan };
    newPlan.invitedPlanUserUids = newInvitedPlanUserUids;
    newPlan.invitedPlanUsers = newInvitedPlanUsers;
    await firestoreUpdatePlan(newPlan);
  };

  const onPlanUserAdminPress = async (index: number) => {
    if (!myPlanUser.isAdmin) {
      console.log("Only admin can change Admin!");
      return;
    }

    const newPlanUsers = plan.planUsers.map(
      (planUser, idx): PlanUser =>
        idx == index ? { ...planUser, isAdmin: !planUser.isAdmin } : planUser
    );

    const adminCount = newPlanUsers.filter(
      (planUser) => planUser.isAdmin
    ).length;

    if (adminCount == 0) {
      console.log("최소한 admin이 한 명은 있어야 합니다.");
      return;
    }

    const newPlan: Plan = { ...plan, planUsers: newPlanUsers };
    console.log("newPlan : ", newPlan);
    await firestoreUpdatePlan(newPlan);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>Members</ThemedText>
        <View style={styles.userSearchContainer}>
          <Feather name="user-plus" size={24} color="black" />
          <TextInput
            style={styles.userSearchInput}
            placeholder="new username"
            value={newUsername}
            onChangeText={setNewUsername}
            autoCapitalize="none"
          />
          <Button
            title={"Add"}
            onPress={addInvitedPlanUser}
            disabled={!myPlanUser.isAdmin}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <ModifyPlanMemberView
          key={myPlanUser.uid}
          userInfo={myPlanUser}
          index={plan.planUserUids.findIndex((uid) => uid === myPlanUser.uid)}
          onAdminPress={onPlanUserAdminPress}
          onRemovePlanUser={removePlanUser}
          myPlanUser={myPlanUser}
        />
        {plan.planUsers.map((planUser, index) => {
          if (planUser.uid != myPlanUser.uid)
            return (
              <ModifyPlanMemberView
                key={planUser.uid}
                userInfo={planUser}
                index={index}
                onAdminPress={onPlanUserAdminPress}
                onRemovePlanUser={removePlanUser}
                myPlanUser={myPlanUser}
              />
            );
        })}
        {plan.invitedPlanUsers.map((invitedPlanUser, index) => {
          return (
            <ModifyPlanMemberView
              key={invitedPlanUser.uid}
              userInfo={invitedPlanUser}
              index={index}
              onRemoveInvitedPlanUser={removeInvitedPlanUser}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    alignItems: "center",
  },
  userSearchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  userSearchInput: {
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    width: "50%",
  },
  userAddButton: {},
  headerTitle: {
    fontSize: 24,
  },
  scrollView: {
    padding: 5,
  },
});
