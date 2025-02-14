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
import { shopPlanUserState } from "@/atoms/shopPlanUserAtom";

export default function SettingGeneral() {
  const [shopPlanUser, setShopPlanUser] = useRecoilState(shopPlanUserState);

  const logoutAction = useMemo(() => {
    const logout = () => {
      setShopPlanUser(null);
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
            source={{ uri: shopPlanUser?.photo as string }} // 이미지 URL
            style={styles.profile}
          />
        }
        title={shopPlanUser?.email.replace(/@gmail\.com$/, "")}
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
