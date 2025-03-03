import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";

interface ModifyPlanMemberViewProps {
  userInfo: PlanUser | InvitedPlanUser;
  myPlanUser?: PlanUser;
  index: number;
  onAdminPress?: (index: number) => void;
  onRemovePlanUser?: (index: number) => void;
  onRemoveInvitedPlanUser?: (index: number) => void;
}

function isPlanUserType(obj: any) {
  return typeof obj.isAdmin === "boolean";
}

export default function ModifyPlanMemberView({
  userInfo,
  myPlanUser,
  index,
  onAdminPress,
  onRemovePlanUser,
  onRemoveInvitedPlanUser,
}: ModifyPlanMemberViewProps) {
  return isPlanUserType(userInfo) ? (
    <View style={styles.container}>
      <ThemedText style={styles.username}>{userInfo.username}</ThemedText>
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
      {userInfo.uid != myPlanUser?.uid && (
        <ThemedTextButton
          onPress={() => {
            onRemovePlanUser?.(index);
          }}
        >
          삭제
        </ThemedTextButton>
      )}
    </View>
  ) : (
    <View style={styles.container}>
      <ThemedText style={styles.username}>{userInfo.username}</ThemedText>
      <ThemedText>초대중</ThemedText>
      <ThemedTextButton
        onPress={() => {
          onRemoveInvitedPlanUser?.(index);
        }}
      >
        삭제
      </ThemedTextButton>
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
