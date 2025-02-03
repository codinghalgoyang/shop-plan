import { userState } from "@/atoms/userAtom";
import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";

export default function IndexScreen() {
  const [user, setUser] = useRecoilState(userState);
  const [nextPage, setNextPage] = useState("");

  const checkUserSession = async () => {
    try {
      const user = await GoogleSignin.getCurrentUser();
      if (user) {
        console.log("사용자가 로그인 상태입니다:", user);
        setUser(user);
        setNextPage("/home");
      } else {
        console.log("사용자가 로그인하지 않았습니다.");
        setNextPage("/login");
      }
    } catch (error) {
      console.error("세션 확인 중 오류 발생:", error);
      setNextPage("/error");
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_SIGN_IN_CLIENT_ID,
    });
    checkUserSession();
  }, []);

  useEffect(() => {
    if (nextPage) {
      const timer = setTimeout(() => {
        router.replace(nextPage as "/home" | "/login" | "/error");
      }, 2000);

      // 컴포넌트 언마운트 시 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [nextPage]);

  return (
    <View style={styles.container}>
      <Text>Index Screen. Jump to next screen in 2 seconds</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
