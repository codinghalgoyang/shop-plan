import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import Paper from "@/components/Common/Paper";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import { firestoreGetUser } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { FONT_SIZE } from "@/utils/Shapes";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
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
      <View style={styles.container}>
        <ThemedText style={{ fontSize: FONT_SIZE.big * 1.5 }} color="gray">
          환영합니다
        </ThemedText>
        <Paper style={styles.descriptionContainer}>
          <ThemedText style={{ fontSize: FONT_SIZE.big * 2 }} weight="bold">
            장보기 플랜을
          </ThemedText>
          <ThemedText style={{ fontSize: FONT_SIZE.big * 2 }} weight="bold">
            공유하세요
          </ThemedText>
        </Paper>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signin}
        />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  descriptionContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
