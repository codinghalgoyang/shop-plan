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

const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === "development";

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
            message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
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
        message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
      });
      return;
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: IS_DEV
        ? "330673068311-unr7ftv48ldge4ujdm4p4h37k1sfda51.apps.googleusercontent.com"
        : "729367066840-t6c7vbdd5p8hdt2phma8f9caqch64d13.apps.googleusercontent.com",
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
