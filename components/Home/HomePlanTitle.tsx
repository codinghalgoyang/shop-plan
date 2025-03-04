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
      <ThemedText style={styles.title}>{title}</ThemedText>
      <View style={styles.usersContainer}>
        <ThemedText style={styles.userName}>with</ThemedText>
        {users.map((planUser, i) => (
          <ThemedText key={planUser.uid} style={styles.userName}>
            {planUser.username}
            {i != users.length - 1 && ","}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 22,
    fontWeight: 600,
  },
  usersContainer: {
    flexDirection: "row",
    gap: 5,
    marginLeft: 1,
  },
  userName: {
    color: Colors.content.disabled,
    fontSize: 12,
  },
});
