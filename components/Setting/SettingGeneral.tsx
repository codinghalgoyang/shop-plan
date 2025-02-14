import { useRecoilState } from "recoil";
import SettingItem from "./SettingItem";
import SettingItemGroup from "./SettingItemGroup";
import {
  Button,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useMemo } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { userInfoState } from "@/atoms/userInfo";

export default function SettingGeneral() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const logoutAction = useMemo(() => {
    const logout = () => {
      setUserInfo(null);
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      router.replace("/login");
    };

    return (
      <TouchableOpacity onPress={logout}>
        <View style={styles.logoutAction}>
          <Text>로그아웃</Text>
          <MaterialIcons name="arrow-forward-ios" size={24} />
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <SettingItemGroup title={"일반"}>
      <SettingItem
        icon={
          <Image
            source={{ uri: userInfo?.photo as string }} // 이미지 URL
            style={styles.profile}
          />
        }
        title={userInfo?.email.replace(/@gmail\.com$/, "")}
        action={logoutAction}
      ></SettingItem>
    </SettingItemGroup>
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
