import {
  GoogleSignin,
  GoogleSigninButton,
  SignInResponse,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function IndexScreen() {
  const [error, setError] = useState<Error | null>(null);
  const [userInfo, setUserInfo] = useState<SignInResponse | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_SIGN_IN_CLIENT_ID,
    });
  }, []);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserInfo(user);
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

  return (
    <View style={styles.container}>
      {error && <Text>error : {JSON.stringify(error)}</Text>}
      {userInfo && <Text>{JSON.stringify(userInfo.data?.user)}</Text>}
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
