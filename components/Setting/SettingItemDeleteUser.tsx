import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "../Common/ThemedText";
import { Colors } from "@/utils/Colors";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ThemedIcon from "../Common/ThemedIcon";
import { router } from "expo-router";
import { useRecoilState } from "recoil";
import { defaultUser, userState } from "@/atoms/userAtom";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function SettingItemDeleteUser() {
  const [user, setUser] = useRecoilState(userState);
  return (
    <TouchableOpacity
      onPress={() => {
        setUser(defaultUser);
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
        router.dismissAll();
        router.push("/login");
      }}
    >
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
