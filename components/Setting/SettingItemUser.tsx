import { useRecoilState } from "recoil";
import {
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useMemo } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { defaultUser, userState } from "@/atoms/userAtom";
import SettingItem from "./SettingItem";
import ThemedText from "../Common/ThemedText";

export default function SettingItemUser() {
  const [user, setUser] = useRecoilState(userState);

  const logoutAction = useMemo(() => {
    const logout = () => {
      setUser(defaultUser);
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      router.dismissAll();
      router.replace("/login");
    };

    return (
      <TouchableOpacity onPress={logout}>
        <View style={styles.logoutAction}>
          <ThemedText>로그아웃</ThemedText>
          <MaterialIcons name="arrow-forward-ios" size={24} />
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <SettingItem
      icon={
        <Image
          source={{ uri: user?.photo as string }} // 이미지 URL
          style={styles.profile}
        />
      }
      title={user?.username}
      action={logoutAction}
    ></SettingItem>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
  },
  logoutAction: {
    flexDirection: "row",
    gap: 1,
    alignItems: "center",
  },
  logoutText: {},
});
