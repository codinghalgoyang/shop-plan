import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ThemedIcon from "../Common/ThemedIcon";
import { router } from "expo-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { defaultUser, userState } from "@/atoms/userAtom";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { plansState } from "@/atoms/plansAtom";
import { invitedPlansState } from "@/atoms/invitedPlanAtom";
import { modalState } from "@/atoms/modalAtom";
import { firestoreDeleteUser } from "@/utils/api";

export default function SettingItemDeleteUser() {
  const [user, setUser] = useRecoilState(userState);
  const setModal = useSetRecoilState(modalState);
  const plans = useRecoilValue(plansState);
  const invitedPlans = useRecoilValue(invitedPlansState);

  const deleteUser = () => {
    if (plans.length !== 0 || invitedPlans.length !== 0) {
      setModal({
        visible: true,
        message:
          "나의 플랜과 초대받은 플랜을 모두 정리 후 회원탈퇴가 가능합니다.",
      });
      return;
    }
    setModal({
      visible: true,
      message: "회원탈퇴를 하시겠습니까?",
      onConfirm: async () => {
        try {
          GoogleSignin.revokeAccess();
          GoogleSignin.signOut();
          router.dismissAll();
          router.push("/login");
          firestoreDeleteUser(user);
        } catch (error) {
          setModal({
            visible: true,
            title: "서버 통신 에러",
            message: `서버와 연결상태가 좋지 않습니다. (${error})`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  return (
    <TouchableOpacity onPress={deleteUser}>
      <View style={styles.container}>
        <ThemedText>회원탈퇴</ThemedText>
        <ThemedIcon IconComponent={SimpleLineIcons} iconName="arrow-right" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    backgroundColor: Colors.background.white,
    borderColor: Colors.border,
  },
});
