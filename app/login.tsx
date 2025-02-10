import { googleUserState } from "@/atoms/googleUserAtom";
import { shopPlanUserState } from "@/atoms/shopPlanUserAtom";
import ScreenView from "@/components/ScreenView";
import { getShopPlanUser } from "@/utils/api";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { useSetRecoilState } from "recoil";

export default function LoginScreen() {
  const setGoogleUser = useSetRecoilState(googleUserState);
  const setShopPlanUser = useSetRecoilState(shopPlanUserState);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const googleUser = response.data;
      setGoogleUser(googleUser);
      const shopPlanUser = await getShopPlanUser(googleUser?.user.id);
      if (shopPlanUser) {
        setShopPlanUser(shopPlanUser);
        router.replace("/home");
      } else {
        router.replace("/signup");
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
