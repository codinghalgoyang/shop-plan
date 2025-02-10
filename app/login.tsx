import { googleUserState, userState } from "@/atoms/googleUserAtom";
import ScreenView from "@/components/ScreenView";
import { checkUserExists } from "@/utils/api";
import { db } from "@/utils/firebaseConfig";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { StyleSheet, Text, View } from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function LoginScreen() {
  const setGoogleUser = useSetRecoilState(googleUserState);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const googleUser = response.data;
      setGoogleUser(googleUser);
      const userExists = await checkUserExists(googleUser?.user.id);
      if (userExists) {
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
