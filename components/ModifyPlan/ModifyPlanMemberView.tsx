import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import { InvitedPlanUser, PlanUser } from "@/utils/types";

interface ModifyPlanMemberViewProps {
  userInfo: PlanUser | InvitedPlanUser;
  index: number;
  onAdminPress?: (index: number) => void;
  onRemoveInvitedPlanUser?: (index: number) => void;
}

function isPlanUserType(obj: any) {
  return typeof obj.isAdmin === "boolean";
}

export default function ModifyPlanMemberView({
  userInfo,
  index,
  onAdminPress,
  onRemoveInvitedPlanUser,
}: ModifyPlanMemberViewProps) {
  return isPlanUserType(userInfo) ? (
    <View style={styles.container}>
      <Text style={styles.username}>{userInfo.username}</Text>
      <TouchableOpacity
        onPress={() => {
          onAdminPress?.(index);
        }}
      >
        <Ionicons
          name="shield-checkmark"
          size={20}
          color={(userInfo as PlanUser).isAdmin ? "red" : "grey"}
        />
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.username}>{userInfo.username}</Text>
      <Text>초대중</Text>
      <Button
        title="삭제"
        onPress={() => {
          onRemoveInvitedPlanUser?.(index);
        }}
      />
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
