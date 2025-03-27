import { modalState } from "@/atoms/modalAtom";
import { userState } from "@/atoms/userAtom";
import { firestoreGetUser } from "@/utils/api";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const getCurrentUser = async () => {
  const googleUser = await GoogleSignin.getCurrentUser();
  if (googleUser) {
    const user = await firestoreGetUser(googleUser.user.id);
    if (user) {
      return user;
    } else {
      // google loginend but not join
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
    }
  }

  return null;
};

export default function IndexScreen() {
  const setModal = useSetRecoilState(modalState);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const initialze = async () => {
      try {
        GoogleSignin.configure();
        const user = await getCurrentUser();

        SplashScreen.hide();
        
        if (user) {
          setUser(user);
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        setModal({
          visible: true,
          title: "앱 초기화 에러",
          message: `앱을 초기화하는 도중 에러가 발생했습니다. 인터넷 연결이 되었는지 확인해주세요. (${error})`,
        });
      }
    };

    initialze();
  }, []);

  return null;
}
