import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { InvitedPlanUser, PlanUser } from "@/utils/types";

interface ModifyPlanMemberViewProps {
  userInfo: PlanUser | InvitedPlanUser;
  index?: number;
  onPress?: (index: number) => void;
}

function isPlanUserType(obj: any) {
  return typeof obj.isAdmin === "boolean";
}

export default function ModifyPlanMemberView({
  userInfo,
  index,
  onPress,
}: ModifyPlanMemberViewProps) {
  return isPlanUserType(userInfo) ? (
    <View style={styles.container}>
      <Text style={styles.username}>{userInfo.username}</Text>

      <TouchableOpacity
        onPress={() => {
          console.log("onPress?", onPress);
          if (onPress && (index || index == 0)) {
            onPress(index);
          }
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
