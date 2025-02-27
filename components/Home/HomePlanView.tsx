import { plansState } from "@/atoms/plansAtom";
import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "@/utils/Colors";
import { Bar } from "react-native-progress";

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
        <Text style={styles.title}>{plan.title || "Loading..."}</Text>
        <TouchableOpacity
          style={styles.modifyButtonContainer}
          onPress={() => {
            router.push(`/modify_plan?index=${index}`);
          }}
        >
          <Entypo style={styles.modifyButton} name={"pencil"} />
        </TouchableOpacity>
        <View style={styles.usersContainer}>
          <Text style={styles.userName}>with</Text>
          {plan?.planUsers.map((planUser, i) => (
            <Text key={planUser.uid} style={styles.userName}>
              {planUser.username}
              {i != plan?.planUsers.length - 1 && ","}
            </Text>
          ))}
        </View>
        <View style={styles.barContainer}>
          <Bar
            progress={0.5}
            color={Colors.primary}
            width={null}
            borderColor={Colors.border}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1, // 테두리 두께
    borderColor: Colors.border, // 테두리 색상
    borderRadius: 8,
    backgroundColor: Colors.background.white,
    position: "relative",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
  },
  modifyButtonContainer: {
    padding: 15,
    position: "absolute",
    top: 0,
    right: 0,
  },
  modifyButton: {
    color: Colors.content.black,
    fontSize: 24,
  },
  usersContainer: {
    flexDirection: "row",
    gap: 5,
  },
  userName: {
    color: Colors.content.disabled,
    fontSize: 18,
  },
  barContainer: {
    marginVertical: 5,
  },
});
