import { userState } from "@/atoms/userAtom";
import ScreenView from "@/components/ScreenView";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";

export default function LoginScreen() {
  const [user, setUser] = useRecoilState(userState);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const user = response.data;
      setUser(user);
      router.replace("/home");
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
