import { modalState } from "@/atoms/modalAtom";
import { userState } from "@/atoms/userAtom";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import { firestoreGetUser } from "@/utils/api";
import { Colors } from "@/utils/Colors";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSetRecoilState } from "recoil";

export default function IndexScreen() {
  const setModal = useSetRecoilState(modalState);
  const setUser = useSetRecoilState(userState);
  const [nextPage, setNextPage] = useState("");

  const checkUserSession = async () => {
    console.log("checkUserSession");
    try {
      const googleUser = await GoogleSignin.getCurrentUser();
      console.log("googleUser : ", googleUser);
      if (googleUser) {
        const user = await firestoreGetUser(googleUser.user.id);
        console.log("user : ", user);
        if (user) {
          setUser(user);
          setNextPage("/home");
        } else if (user == null) {
          GoogleSignin.revokeAccess();
          GoogleSignin.signOut();
          router.replace("/login");
        } else {
          setModal({
            visible: true,
            title: "User DB 접속 에러",
            message: `서버와 연결상태가 좋지 않습니다. Google Username : ${googleUser.user.name} / user : ${user}`,
          });
          return;
        }
      } else {
        setNextPage("/login");
      }
    } catch (error) {
      console.log("error : ", error);
      setModal({
        visible: true,
        title: "Google Signin 에러",
        message: `서버와 연결상태가 좋지 않습니다. ${error}`,
      });
      return;
    }
  };

  useEffect(() => {
    GoogleSignin.configure();
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
        <ThemedText style={styles.title}>Shop Plan</ThemedText>
        <View style={styles.byContainer}>
          <ThemedText style={styles.by}>by. 코딩할고양</ThemedText>
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.orange,
  },
  title: {
    color: Colors.content.white,
    fontSize: 48,
    fontWeight: 700,
    margin: "auto",
  },
  byContainer: {
    height: 90,
  },
  by: {
    color: Colors.content.white,
    fontSize: 16,
    margin: "auto",
  },
});
