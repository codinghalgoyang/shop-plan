import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import ThemedText from "../Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedIcon from "../Common/ThemedIcon";
import { Colors } from "@/utils/Colors";
import Paper from "../Common/Paper";

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
    <Paper style={styles.container}>
      <View style={styles.userContainer}>
        <ThemedText>{userInfo.username}</ThemedText>
        <ThemedIcon
          IconComponent={Ionicons}
          iconName="shield-checkmark"
          style={{
            color: (userInfo as PlanUser).isAdmin
              ? Colors.primary
              : Colors.content.disabled,
            padding: 0,
          }}
          onPress={() => {
            onAdminPress?.(index);
          }}
          size="big"
        />
      </View>
      {userInfo.uid != myPlanUser?.uid && (
        <ThemedTextButton
          onPress={() => {
            onRemovePlanUser?.(index);
          }}
        >
          삭제
        </ThemedTextButton>
      )}
    </Paper>
  ) : (
    <Paper style={styles.container}>
      <View style={styles.userContainer}>
        <ThemedText>{userInfo.username}</ThemedText>
        <ThemedText>(초대중)</ThemedText>
      </View>
      <ThemedTextButton
        onPress={() => {
          onRemoveInvitedPlanUser?.(index);
        }}
        buttonStyle={{ backgroundColor: Colors.notification }}
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
    marginBottom: 4,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
