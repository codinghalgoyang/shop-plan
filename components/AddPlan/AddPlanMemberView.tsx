import { StyleSheet, View, TouchableOpacity } from "react-native";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import Paper from "../Common/Paper";

interface AddPlanMemberViewProps {
  userInfo: PlanUser | InvitedPlanUser;
  index?: number;
  onRemoveInvitedPlanUser?: (index: number) => void;
}

function isPlanUserType(obj: any) {
  return typeof obj.isAdmin === "boolean";
}

export default function AddPlanMemberView({
  userInfo,
  index = 0,
  onRemoveInvitedPlanUser,
}: AddPlanMemberViewProps) {
  return isPlanUserType(userInfo) ? (
    <Paper style={styles.container}>
      <View style={styles.userContainer}>
        <ThemedText>
          {userInfo.username}
          {" (나)"}
        </ThemedText>
      </View>
    </Paper>
  ) : (
    <Paper style={styles.container}>
      <View style={styles.userContainer}>
        <ThemedText>{userInfo.username}</ThemedText>
      </View>

      <ThemedTextButton
        onPress={() => {
          onRemoveInvitedPlanUser?.(index);
        }}
        color="orange"
      >
        삭제
      </ThemedTextButton>
    </Paper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    height: 50,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
