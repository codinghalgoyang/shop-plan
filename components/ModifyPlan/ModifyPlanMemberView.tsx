import Fontisto from "@expo/vector-icons/Fontisto";
import { StyleSheet, View, Text } from "react-native";
import { InvitedPlanUser, PlanUser } from "@/utils/types";

interface ModifyPlanMemberViewProps {
  userInfo: PlanUser | InvitedPlanUser;
}

function isPlanUserType(obj: any) {
  return typeof obj.isAdmin === "boolean";
}

export default function ModifyPlanMemberView({
  userInfo,
}: ModifyPlanMemberViewProps) {
  return isPlanUserType(userInfo) ? (
    <View style={styles.container}>
      <Text style={styles.username}>{userInfo.username}</Text>
      {(userInfo as PlanUser).isAdmin && (
        <Fontisto name="star" size={20} color="green" />
      )}
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.username}>{userInfo.username}</Text>
      <Text>초대중</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  username: {
    fontSize: 20,
  },
});
