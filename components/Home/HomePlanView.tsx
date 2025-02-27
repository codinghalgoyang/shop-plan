import { plansState } from "@/atoms/plansAtom";
import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/utils/Colors";

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
            <View style={styles.modifyButtonContainer}>
              <Entypo style={styles.modifyButton} name={"pencil"} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.usersContainer}>
          <AntDesign name="user" style={styles.userIcon} />
          {plan?.planUsers.map((planUser) => (
            <Text key={planUser.uid} style={styles.userName}>
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
    borderWidth: 1, // 테두리 두께
    borderColor: Colors.border, // 테두리 색상
    borderRadius: 8,
    backgroundColor: Colors.background.white,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    marginLeft: 10,
  },
  modifyButtonContainer: {
    padding: 10,
  },
  modifyButton: {
    color: Colors.content.black,
    fontSize: 24,
  },
  usersContainer: {
    flexDirection: "row",
    gap: 5,
    marginHorizontal: 5,
  },
  userIcon: {
    color: Colors.content.disabled,
    fontSize: 24,
  },
  userName: {
    color: Colors.content.disabled,
    fontSize: 18,
  },
});
