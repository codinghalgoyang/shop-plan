import { View, ScrollView, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { InvitedPlanUser, Plan, PlanUser } from "@/utils/types";
import { firestoreFindUser, firestoreUpdatePlan } from "@/utils/api";
import { userState } from "@/atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
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
  ) || { uid: "", isAdmin: false, username: "", createdAt: 0 };

  const [newUsername, setNewUsername] = useState("");

  const removePlanUser = async (index: number) => {
    // myPlanUser.isAdmin && index is not mine
    setModal({
      visible: true,
      title: "유저 삭제",
      message: `'${plan.planUsers[index].username}'을 플랜에서 제외합니다.`,
      onConfirm: async () => {
        const newPlanUserUids: string[] = plan.planUserUids.filter(
          (_, idx) => idx != index
        );
        const newPlanUsers: PlanUser[] = plan.planUsers.filter(
          (_, idx) => idx != index
        );

        const newPlan: Plan = { ...plan };
        newPlan.planUserUids = newPlanUserUids;
        newPlan.planUsers = newPlanUsers;
        try {
          await firestoreUpdatePlan(newPlan);
        } catch (error) {
          setModal({
            visible: true,
            title: "서버 통신 에러",
            message: `서버와 연결상태가 좋지 않습니다. (${error})`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  const addInvitedPlanUser = async () => {
    try {
      const newUser = await firestoreFindUser(newUsername);

      if (newUser == null) {
        setModal({
          visible: true,
          title: "안내",
          message: `'${newUser}'를 찾을 수 없습니다.`,
        });
        return;
      }

      setNewUsername("");

      const newPlan: Plan = { ...plan };
      newPlan.invitedPlanUserUids = [
        ...newPlan.invitedPlanUserUids,
        newUser.uid,
      ];
      newPlan.invitedPlanUsers = [...newPlan.invitedPlanUsers, newUser];
      await firestoreUpdatePlan(newPlan);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
      return;
    }
  };

  const removeInvitedPlanUser = async (index: number) => {
    setModal({
      visible: true,
      title: "초대 사용자 삭제",
      message: `'${plan.planUsers[index].username}' 사용자 초대를 취소합니다.`,
      onConfirm: async () => {
        const newInvitedPlanUserUids: string[] =
          plan.invitedPlanUserUids.filter(
            (invitedPlanUserUid, idx) => idx != index
          );
        const newInvitedPlanUsers: InvitedPlanUser[] =
          plan.invitedPlanUsers.filter((invitedPlanUser, idx) => idx != index);

        const newPlan: Plan = { ...plan };
        newPlan.invitedPlanUserUids = newInvitedPlanUserUids;
        newPlan.invitedPlanUsers = newInvitedPlanUsers;

        try {
          await firestoreUpdatePlan(newPlan);
        } catch (error) {
          setModal({
            visible: true,
            title: "서버 통신 에러",
            message: `서버와 연결상태가 좋지 않습니다. (${error})`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  const onPlanUserAdminPress = async (index: number) => {
    // myPlanUser.isAdmin
    const adminCount = plan.planUsers.filter(
      (planUser) => planUser.isAdmin
    ).length;

    // 관리자가 한 명인데, 그게 나 뿐일때
    if (adminCount == 1) {
      setModal({
        visible: true,
        title: "안내",
        message: "플랜에는 최소 한 명의 관리자가 필요합니다.",
        onConfirm: () => {},
      });
      return;
    } else {
      // 관리자가 여러명일 때,
      setModal({
        visible: true,
        title: "관리자 추가",
        message: `'${plan.planUsers[index].username}'를 관리자에서 사용자로 변경합니다. 변경 후에 해당 사용자는 플랜 제목 변경, 사용자 초대, 삭제 권한등이 사라집니다.`,
        onConfirm: async () => {
          const newPlanUsers = plan.planUsers.map(
            (planUser, idx): PlanUser =>
              idx == index
                ? { ...planUser, isAdmin: !planUser.isAdmin }
                : planUser
          );

          const newPlan: Plan = { ...plan, planUsers: newPlanUsers };

          try {
            await firestoreUpdatePlan(newPlan);
          } catch (error) {
            setModal({
              visible: true,
              title: "서버 통신 에러",
              message: `서버와 연결상태가 좋지 않습니다. (${error})`,
            });
          }
        },
        onCancel: () => {},
      });
    }
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
                : "orange"
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
