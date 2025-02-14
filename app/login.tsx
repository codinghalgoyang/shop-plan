import { userInfoState } from "@/atoms/userInfo";
import ScreenView from "@/components/ScreenView";
import { getUserInfo } from "@/utils/api";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { useSetRecoilState } from "recoil";

export default function LoginScreen() {
  const setUserInfo = useSetRecoilState(userInfoState);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const googleUserInfo = response.data;
      const userInfo = await getUserInfo(googleUserInfo?.user.id);
      if (userInfo) {
        setUserInfo(userInfo);
        router.replace("/home");
      } else {
        router.replace(
          `/signup?id=${googleUserInfo?.user.id}&email=${googleUserInfo?.user.email}&photo=${googleUserInfo?.user.photo}`
        );
      }
    } catch (e) {
      router.replace("/error");
    }
  };

  return (
    <ScreenView>
      <Text>Login Screen</Text>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Dark}
        onPress={signin}
      />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
