import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { InvitedPlanUser, Plan, PlanUser } from "@/utils/types";
import { firestoreFindUser, firestoreUpdatePlan } from "@/utils/api";
import { userState } from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedIcon from "../Common/ThemedIcon";
import ThemedTextInput from "../Common/ThemedTextInput";
import EditPlanMemberView from "./EditPlanMemberView";

interface EditMemberViewProps {
  plan: Plan;
}

export default function EditPlanMembersView({ plan }: EditMemberViewProps) {
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

  const adminUsers = plan.planUsers.filter((user) => user.isAdmin);
  const normalUsers = plan.planUsers.filter((user) => !user.isAdmin);

  return (
    <View style={styles.container}>
      {myPlanUser.isAdmin && (
        <View style={styles.userSearchContainer}>
          <ThemedTextInput
            style={styles.userSearchInput}
            placeholder="사용자 검색"
            value={newUsername}
            onChangeText={setNewUsername}
            autoCapitalize="none"
          />
          <ThemedTextButton
            onPress={addInvitedPlanUser}
            disabled={!myPlanUser.isAdmin}
          >
            추가
          </ThemedTextButton>
        </View>
      )}
      <ScrollView contentContainerStyle={{ gap: 4 }}>
        <ThemedText size="small" color="gray">
          관리자
        </ThemedText>
        {adminUsers.map((planUser, index) => {
          return (
            <EditPlanMemberView
              key={planUser.uid}
              userInfo={planUser}
              index={index}
              onAdminPress={onPlanUserAdminPress}
              onRemovePlanUser={removePlanUser}
              myPlanUser={myPlanUser}
            />
          );
        })}
        {normalUsers.length !== 0 && (
          <ThemedText size="small" color="gray">
            일반 사용자
          </ThemedText>
        )}
        {normalUsers.map((planUser, index) => {
          return (
            <EditPlanMemberView
              key={planUser.uid}
              userInfo={planUser}
              index={index}
              myPlanUser={myPlanUser}
            />
          );
        })}
        {plan.invitedPlanUsers.length !== 0 && (
          <ThemedText size="small" color="gray">
            초대중인 사용자
          </ThemedText>
        )}
        {plan.invitedPlanUsers.map((invitedPlanUser, index) => {
          return (
            <EditPlanMemberView
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
  container: { flex: 1, gap: 8 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  userSearchInput: {
    flex: 1,
  },
});
