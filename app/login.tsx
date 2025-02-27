import { userState } from "@/atoms/userAtom";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import { firestoreGetUser } from "@/utils/api";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { useSetRecoilState } from "recoil";

export default function LoginScreen() {
  const setUser = useSetRecoilState(userState);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const googleUserInfo = response.data;
      if (googleUserInfo) {
        const user = await firestoreGetUser(googleUserInfo?.user.id);
        if (user) {
          setUser(user);
          router.replace("/home");
        } else {
          router.replace(
            `/signup?uid=${googleUserInfo?.user.id}&email=${googleUserInfo?.user.email}&photo=${googleUserInfo?.user.photo}`
          );
        }
      }
    } catch (e) {
      router.replace("/error");
    }
  };

  return (
    <ScreenView>
      <ThemedText>Login Screen</ThemedText>
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
