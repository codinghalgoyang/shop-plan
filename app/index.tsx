import { userInfoState } from "@/atoms/userInfo";
import ScreenView from "@/components/ScreenView";
import { getUserInfo } from "@/utils/api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useSetRecoilState } from "recoil";

export default function IndexScreen() {
  const setUserInfo = useSetRecoilState(userInfoState);
  const [nextPage, setNextPage] = useState("");

  const checkUserSession = async () => {
    try {
      const googleUser = await GoogleSignin.getCurrentUser();
      if (googleUser) {
        console.log("사용자가 로그인 상태입니다:");
        const userInfo = await getUserInfo(googleUser?.user.id);
        if (userInfo) {
          setUserInfo(userInfo);
          setNextPage("/home");
        } else {
          GoogleSignin.revokeAccess();
          GoogleSignin.signOut();
          router.replace("/login");
        }
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
    <ScreenView>
      <Text>Index Screen. Jump to next screen in 2 seconds</Text>
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
