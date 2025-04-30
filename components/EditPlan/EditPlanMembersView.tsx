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
  const isDuplicateUsername =
    plan.planUsers.find((planUser) => planUser.username === newUsername) !==
      undefined ||
    plan.invitedPlanUsers.find(
      (invitedPlanUser) => invitedPlanUser.username === newUsername
    ) !== undefined;

  const removePlanUser = async (userInfo: PlanUser | InvitedPlanUser) => {
    // myPlanUser.isAdmin && index is not mine
    setModal({
      visible: true,
      title: "유저 삭제",
      message: `'${userInfo.username}'을 플랜에서 제외합니다.`,
      onConfirm: async () => {
        const newPlanUserUids: string[] = plan.planUserUids.filter(
          (uid) => uid !== userInfo.uid
        );
        const newPlanUsers: PlanUser[] = plan.planUsers.filter(
          (planUser) => planUser.uid !== userInfo.uid
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
          message: `유저 '${newUsername}'를 찾을 수 없습니다.`,
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

  const removeInvitedPlanUser = async (
    userInfo: PlanUser | InvitedPlanUser
  ) => {
    setModal({
      visible: true,
      title: "초대 사용자 삭제",
      message: `'${userInfo.username}' 사용자 초대를 취소합니다.`,
      onConfirm: async () => {
        const newInvitedPlanUserUids: string[] =
          plan.invitedPlanUserUids.filter(
            (invitedPlanUserUid) => invitedPlanUserUid !== userInfo.uid
          );
        const newInvitedPlanUsers: InvitedPlanUser[] =
          plan.invitedPlanUsers.filter(
            (invitedPlanUser) => invitedPlanUser.uid !== userInfo.uid
          );

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

  const onPlanUserAdminPress = async (userInfo: PlanUser | InvitedPlanUser) => {
    // myPlanUser.isAdmin
    const adminCount = plan.planUsers.filter(
      (planUser) => planUser.isAdmin
    ).length;

    const targetPlanUser: PlanUser = userInfo as PlanUser;
    if (targetPlanUser.isAdmin) {
      // 일반 멤버로 변경
      if (adminCount == 1) {
        // 관리자가 한 명일 때(그게 나 임)
        setModal({
          visible: true,
          title: "안내",
          message: "플랜에는 최소 한 명의 관리자가 필요합니다.",
          onConfirm: () => {},
        });
      } else {
        setModal({
          visible: true,
          title: "관리자 권한 제거",
          message: `'${userInfo.username}'를 관리자에서 일반 멤버로 변경합니다. 해당 멤버는 플랜 제목 변경, 사용자 초대, 삭제 권한 등을 잃게 됩니다.`,
          onConfirm: async () => {
            const newPlanUsers = plan.planUsers.map((planUser) =>
              planUser.uid === userInfo.uid
                ? { ...planUser, isAdmin: false }
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
    } else if (!targetPlanUser.isAdmin) {
      // 관리자로 변경
      setModal({
        visible: true,
        title: "관리자 추가",
        message: `'${userInfo.username}'를 관리자로 변경합니다. 해당 멤버는 플랜 제목 변경, 사용자 초대, 삭제 권한 등을 얻게 됩니다.`,
        onConfirm: async () => {
          const newPlanUsers = plan.planUsers.map((planUser) =>
            planUser.uid === userInfo.uid
              ? { ...planUser, isAdmin: true }
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
            disabled={
              newUsername == "" ||
              newUsername == myPlanUser.username ||
              isDuplicateUsername
            }
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
            일반 멤버
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
