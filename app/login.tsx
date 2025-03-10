import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import Paper from "@/components/Common/Paper";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import { firestoreGetUser } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { FONT_SIZE } from "@/utils/Shapes";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSetRecoilState } from "recoil";
import AntDesign from "@expo/vector-icons/AntDesign";

const descriptions: string[][] = [
  ["빠짐없이 구매하세요", "쇼핑 목록을 확인해서", "잊지 말고 구매하세요"],
  [
    "시간과 돈을 절약하세요",
    "쇼핑 목록을 작성하면",
    "장볼 때 시간과 돈을 아낄 수 있어요",
  ],
  [
    "친구 또는 가족과 함께 하세요",
    "목록 추가, 삭제, 완료가",
    "실시간으로 공유됩니다",
  ],
  ["시작하세요"],
];

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
        <ThemedTextButton
          color="orange"
          type="fill"
          size="big"
          onPress={signin}
        >
          <AntDesign name="google" size={24} color={Colors.content.white} />
          {" 구글 계정으로 로그인"}
        </ThemedTextButton>
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
