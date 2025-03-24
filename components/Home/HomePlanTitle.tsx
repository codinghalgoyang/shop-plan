import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { PlanUser } from "@/utils/types";
import ThemedTextButton from "../Common/ThemedTextButton";

interface HomePlanTitleProps {
  title: string;
  users: PlanUser[];
  index: number;
}

export default function HomePlanTitle({
  title,
  users,
  index,
}: HomePlanTitleProps) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <ThemedText weight="bold" numberOfLines={1} style={{ flex: 1 }}>
          {title}
        </ThemedText>
        <ThemedTextButton
          size="small"
          color="gray"
          buttonStyle={styles.editButton}
          onPress={() => {
            router.push(`/edit_plan?index=${index}`);
          }}
        >
          편집
        </ThemedTextButton>
      </View>
      <View style={styles.usersContainer}>
        <ThemedText size="small" color="gray">
          with
        </ThemedText>
        {users.map((planUser, i) => (
          <ThemedText key={planUser.uid} color="gray" size="small">
            {planUser.username}
            {i != users.length - 1 && ","}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0, flex: 1 },
  usersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 1,
  },
  editButton: {
    marginTop: -4,
    marginRight: -8,
  },
});
