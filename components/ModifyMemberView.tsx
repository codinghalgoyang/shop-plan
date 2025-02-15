import { PlanUserInfos, UserInfo } from "@/utils/types";
import { View, Text, ScrollView, StyleSheet } from "react-native";

interface ModifyMemberViewProps {
  userInfo: UserInfo | null;
  newPlanUserInfos?: PlanUserInfos;
  setNewPlanUserInfos: (newPlanUserInfos: PlanUserInfos) => void;
}

export default function ModifyMemberView({
  userInfo,
  newPlanUserInfos,
  setNewPlanUserInfos,
}: ModifyMemberViewProps) {
  return (
    <View>
      <Text>Members</Text>
      <ScrollView>
        {
          <View key={userInfo?.uid}>
            <Text>{userInfo?.username}</Text>
          </View>
        }
        {newPlanUserInfos?.planUsers.map((planUserInfo) => {
          if (planUserInfo.uid == userInfo?.uid) return null;
          return (
            <View key={planUserInfo.uid}>
              <Text>{planUserInfo.username}</Text>
            </View>
          );
        })}
        {newPlanUserInfos?.planInvitedUsers.map((invitedUser) => {
          return (
            <View key={invitedUser.uid}>
              <Text>{invitedUser.username}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
