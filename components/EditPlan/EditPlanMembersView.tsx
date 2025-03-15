import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { InvitedPlanUser, Plan, PlanUser } from "@/utils/types";
import { firestoreFindUser, firestoreUpdatePlan } from "@/utils/api";
import { userState } from "@/atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedIcon from "../Common/ThemedIcon";
import ThemedTextInput from "../Common/ThemedTextInput";
import EditPlanMemberView from "./EditPlanMemberView";
import { modalState } from "@/atoms/modalAtom";

interface EditMemberViewProps {
  plan: Plan;
}

export default function EditPlanMembersView({ plan }: EditMemberViewProps) {
  const setModal = useSetRecoilState(modalState);
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
    if (newUser == false) {
      setModal({
        visible: true,
        message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
      });
      return;
    }

    if (newUser == null) {
      setModal({
        visible: true,
        message: `'${newUser}'를 찾을 수 없습니다.`,
      });
      return;
    }

    setNewUsername("");

    const newPlan: Plan = { ...plan };
    newPlan.invitedPlanUserUids = [...newPlan.invitedPlanUserUids, newUser.uid];
    newPlan.invitedPlanUsers = [...newPlan.invitedPlanUsers, newUser];
    const result = await firestoreUpdatePlan(newPlan);
    if (result == false) {
      setModal({
        visible: true,
        message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
      });
    }
  };

  const removeInvitedPlanUser = async (index: number) => {
    if (!myPlanUser.isAdmin) {
      console.log("Only admin can change Admin!");
      return;
    }

    const newInvitedPlanUserUids: string[] = plan.invitedPlanUserUids.filter(
      (invitedPlanUserUid, idx) => idx != index
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
            disabled={newUsername == "" || newUsername == myPlanUser.username}
            color={
              newUsername == "" || newUsername == myPlanUser.username
                ? "gray"
                : "blue"
            }
            type="fill"
          >
            초대
          </ThemedTextButton>
        </View>
      )}
      <ScrollView contentContainerStyle={{ gap: 4 }}>
        <ThemedText size="small" color="gray">
          관리자
        </ThemedText>
        {plan.planUsers.map((planUser, index) => {
          // adminUsers로 map을 돌리면 index가 안맞아서 plan.planUser로 돌려야함.
          if (!planUser.isAdmin) return null;
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
            사용자
          </ThemedText>
        )}
        {plan.planUsers.map((planUser, index) => {
          // normalUsers로 map을 돌리면 index가 안맞아서 plan.planUser로 돌려야함.
          if (planUser.isAdmin) return null;
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
              myPlanUser={myPlanUser}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 8 },
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
