import { StyleSheet, View, TouchableOpacity } from "react-native";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import Paper from "../Common/Paper";

interface EditPlanMemberViewProps {
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

export default function EditPlanMemberView({
  userInfo,
  myPlanUser,
  index,
  onAdminPress,
  onRemovePlanUser,
  onRemoveInvitedPlanUser,
}: EditPlanMemberViewProps) {
  return isPlanUserType(userInfo) ? (
    <Paper style={styles.container}>
      <View style={styles.userContainer}>
        <ThemedText>
          {userInfo.username}
          {myPlanUser?.uid == userInfo.uid && " (나)"}
        </ThemedText>
      </View>
      <View style={styles.buttonContainer}>
        {myPlanUser?.isAdmin && (
          <ThemedTextButton
            onPress={() => {
              onAdminPress?.(index);
            }}
            color={(userInfo as PlanUser).isAdmin ? "blue" : "gray"}
          >
            {(userInfo as PlanUser).isAdmin ? "관리자" : "사용자"}
          </ThemedTextButton>
        )}
        {userInfo.uid != myPlanUser?.uid && myPlanUser?.isAdmin && (
          <ThemedTextButton
            onPress={() => {
              onRemovePlanUser?.(index);
            }}
            color="orange"
          >
            삭제
          </ThemedTextButton>
        )}
      </View>
    </Paper>
  ) : (
    <Paper style={styles.container}>
      <View style={styles.userContainer}>
        <ThemedText>{userInfo.username}</ThemedText>
      </View>
      {myPlanUser?.isAdmin && (
        <ThemedTextButton
          onPress={() => {
            onRemoveInvitedPlanUser?.(index);
          }}
          color="orange"
        >
          삭제
        </ThemedTextButton>
      )}
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
