import { modalState } from "@/atoms/modalAtom";
import { userState } from "@/atoms/userAtom";
import { firestoreGetUser } from "@/utils/api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function IndexScreen() {
  const setModal = useSetRecoilState(modalState);
  const setUser = useSetRecoilState(userState);
  const [nextPage, setNextPage] = useState("");

  const checkUserSession = async () => {
    try {
      const googleUser = await GoogleSignin.getCurrentUser();
      if (googleUser) {
        const user = await firestoreGetUser(googleUser.user.id);
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
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (nextPage) {
      router.replace(nextPage as "/home" | "/login" | "/error");
    }
  }, [nextPage]);

  return null;
}
