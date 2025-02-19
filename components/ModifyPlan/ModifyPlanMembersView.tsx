import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { InvitedPlanUser, Plan, PlanUser } from "@/utils/types";
import {
  firestoreFindUser,
  firestoreRemovePlan,
  firestoreUpdatePlan,
} from "@/utils/api";
import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import ModifyPlanMemberView from "./ModifyPlanMemberView";
import { router } from "expo-router";

interface ModifyMemberViewProps {
  plan: Plan;
}

export default function ModifyPlanMembersView({ plan }: ModifyMemberViewProps) {
  const user = useRecoilValue(userState);
  const myPlanUser: PlanUser | undefined = plan.planUsers.find(
    (planUser) => planUser.uid == user.uid
  );
  const [newUsername, setNewUsername] = useState("");

  const removePlanUser = async (index: number) => {
    if (!myPlanUser?.isAdmin) {
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
    if (!myPlanUser?.isAdmin) {
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
    if (!myPlanUser?.isAdmin) {
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

  const removePlan = async () => {
    firestoreRemovePlan(plan.id);
    router.back();
  };

  const withdrawPlan = async () => {
    // 나 혼자만 있을 때
    if (plan.planUserUids.length == 1) {
      firestoreRemovePlan(plan.id);
      router.back();
    } else {
      let myPlanUserIndex = 0;
      plan.planUserUids.forEach((planUserUid, index) => {
        if (planUserUid == myPlanUser?.uid) {
          myPlanUserIndex = index;
          return;
        }
      });

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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Members</Text>
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
            disabled={!myPlanUser?.isAdmin}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        {plan.planUsers.map((planUser, index) => {
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
      <Button title="Plan 나가기" onPress={withdrawPlan} />
      <Button title="Plan 삭제" onPress={removePlan} />
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
