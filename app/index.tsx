import { userState } from "@/atoms/userAtom";
import ScreenView from "@/components/ScreenView";
import { firestoreGetUser } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSetRecoilState } from "recoil";

export default function IndexScreen() {
  const setUser = useSetRecoilState(userState);
  const [nextPage, setNextPage] = useState("");

  const checkUserSession = async () => {
    try {
      const googleUser = await GoogleSignin.getCurrentUser();
      if (googleUser) {
        console.log("사용자가 로그인 상태입니다:");
        const user = await firestoreGetUser(googleUser.user.id);
        if (user) {
          setUser(user);
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
      }, 1000);

      // 컴포넌트 언마운트 시 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [nextPage]);

  return (
    <ScreenView>
      <View style={styles.container}>
        <Text style={styles.logo}>Shop Plan</Text>
        <View style={styles.byContainer}>
          <Text style={styles.by}>by. 코딩할고양</Text>
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  logo: {
    color: Colors.content.black,
    fontSize: 48,
    fontWeight: 700,
    margin: "auto",
  },
  byContainer: {
    height: 90,
  },
  by: {
    color: Colors.content.disabled,
    fontSize: 16,
    margin: "auto",
  },
});
