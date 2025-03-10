import Header from "@/components/Common/Header";
import { ScrollView, StyleSheet, View } from "react-native";
import ScreenView from "@/components/Common/ScreenView";
import SettingItemUser from "@/components/Setting/SettingItemUser";
import SettingItemAOD from "@/components/Setting/SettingItemAOD";
import { Colors } from "@/utils/Colors";
import Paper from "@/components/Common/Paper";
import { useRecoilState } from "recoil";
import { defaultUser, userState } from "@/atoms/userAtom";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedIcon from "@/components/Common/ThemedIcon";
import { useMemo } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

export default function SettingScreen() {
  const [user, setUser] = useRecoilState(userState);

  const logout = () => {
    setUser(defaultUser);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    router.dismissAll();
    router.replace("/login");
  };

  return (
    <ScreenView>
      <Header title="Setting" enableBackAction={true} />
      <ScrollView style={styles.container}>
        <SettingItemUser />
        <SettingItemAOD />
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
  },
});
