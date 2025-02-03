import {
  GoogleSignin,
  GoogleSigninButton,
  User,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  const [error, setError] = useState<Error | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const checkUserSession = async () => {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      if (userInfo) {
        console.log("사용자가 로그인 상태입니다:", userInfo);
        setUserInfo(userInfo);
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
      const userInfo = response.data;
      setUserInfo(userInfo);
      setError(null);
    } catch (e) {
      setError(e as Error);
    }
  };

  const logout = () => {
    setUserInfo(null);
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
      {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
      {userInfo ? (
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
