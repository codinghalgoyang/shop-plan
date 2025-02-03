import { userState } from "@/atoms/userAtom";
import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useRecoilState } from "recoil";

export default function IndexScreen() {
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useRecoilState(userState);

  const checkUserSession = async () => {
    try {
      const user = await GoogleSignin.getCurrentUser();
      if (user) {
        console.log("사용자가 로그인 상태입니다:", user);
        setUser(user);
      } else {
        console.log("사용자가 로그인하지 않았습니다.");
      }
    } catch (error) {
      console.error("세션 확인 중 오류 발생:", error);
    }
  };

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const user = response.data;
      setUser(user);
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const logout = () => {
    setUser(null);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_SIGN_IN_CLIENT_ID,
    });
    checkUserSession();
  }, []);

  return (
    <View style={styles.container}>
      {error && <Text>error : {JSON.stringify(error)}</Text>}
      {user && <Text>{JSON.stringify(user.user)}</Text>}
      {user ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={signin}
        />
      )}
      <Text>Index Screen</Text>
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
