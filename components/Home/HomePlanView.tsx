import { plansState } from "@/atoms/plansAtom";
import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HomePlanViewProps {
  index: number;
}

export default function HomePlanView({ index }: HomePlanViewProps) {
  const plans = useRecoilValue(plansState);
  const plan = plans[index];

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/plan?index=${index}`);
      }}
    >
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{plan.title || "Loading..."}</Text>
          <TouchableOpacity
            onPress={() => {
              router.push(`/modify_plan?index=${index}`);
            }}
          >
            <Ionicons name={"settings-outline"} size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.usersContainer}>
          {plan?.planUsers.map((planUser) => (
            <Text key={planUser.uid} style={styles.users}>
              {planUser.username}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderWidth: 1, // 테두리 두께
    borderColor: "black", // 테두리 색상
    padding: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
  },
  users: {
    fontSize: 18,
  },
  usersContainer: {
    flexDirection: "row",
    gap: 5,
  },
});
