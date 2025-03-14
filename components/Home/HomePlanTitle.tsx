import { Colors } from "@/utils/Colors";
import { StyleSheet, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { PlanUser } from "@/utils/types";

interface HomePlanTitleProps {
  title: string;
  users: PlanUser[];
}

export default function HomePlanTitle({ title, users }: HomePlanTitleProps) {
  return (
    <View style={styles.container}>
      <ThemedText weight="bold">{title}</ThemedText>
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
  container: { gap: 8 },
  usersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 1,
  },
});
