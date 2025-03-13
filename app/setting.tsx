import Header from "@/components/Common/Header";
import { ScrollView, StyleSheet } from "react-native";
import ScreenView from "@/components/Common/ScreenView";
import SettingItemUser from "@/components/Setting/SettingItemUser";
import SettingItemAOD from "@/components/Setting/SettingItemAOD";
import { Colors } from "@/utils/Colors";
import { useRecoilState } from "recoil";
import { defaultUser, userState } from "@/atoms/userAtom";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import SettingItemTermsOfUse from "@/components/Setting/SettingItemTermsOfUse";
import SettingItemDeleteUser from "@/components/Setting/SettingItemDeleteUser";
import ThemedText from "@/components/Common/ThemedText";

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
      <Header title="설정" enableBackAction={true} />
      <ScrollView style={styles.container}>
        <ThemedText size="small" color="gray" style={{ marginLeft: 8 }}>
          회원 정보
        </ThemedText>
        <SettingItemUser />
        <SettingItemDeleteUser />
        <ThemedText size="small" color="gray" style={{ marginLeft: 8 }}>
          기타
        </ThemedText>
        <SettingItemAOD />
        <SettingItemTermsOfUse />
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
