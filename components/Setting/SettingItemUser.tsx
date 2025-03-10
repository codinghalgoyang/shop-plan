import { useRecoilState } from "recoil";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { defaultUser, userState } from "@/atoms/userAtom";
import ThemedText from "../Common/ThemedText";
import Paper from "../Common/Paper";
import ThemedTextButton from "../Common/ThemedTextButton";
import { Colors } from "@/utils/Colors";

export default function SettingItemUser() {
  const [user, setUser] = useRecoilState(userState);

  const logout = () => {
    setUser(defaultUser);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    router.dismissAll();
    router.replace("/login");
  };

  return (
    <Paper style={styles.container}>
      <View>
        <ThemedText>{user.username}</ThemedText>
        <ThemedText size="small" color="gray">
          {user.email}
        </ThemedText>
      </View>
      <ThemedTextButton size="small" color="orange" onPress={logout}>
        로그아웃
      </ThemedTextButton>
    </Paper>
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
