import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import { firestoreAddUser } from "@/utils/api";
import { User } from "@/utils/types";
import { param2string } from "@/utils/utils";

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { useSetRecoilState } from "recoil";
import ThemedTextButton from "@/components/Common/ThemedTextButton";

export default function SignupScreen() {
  const setUser = useSetRecoilState(userState);
  const [username, setUsername] = useState("");
  const {
    uid: paramUid,
    email: paramEmail,
    photo: paramPhoto,
  } = useLocalSearchParams();
  const uid = param2string(paramUid);
  const email = param2string(paramEmail);
  const photo = param2string(paramPhoto);

  const signup = async () => {
    if (!username) {
      console.log("Input username");
      return;
    }

    const saveUserInfo = async () => {
      const user: User = {
        uid: uid,
        email: email,
        photo: photo,
        username: username,
      };

      // TODO: username 검사
      const isSuccess = await firestoreAddUser(user);
      if (isSuccess) {
        setUser(user);
        router.replace("/home");
      }
    };
    saveUserInfo();
  };

  return (
    <ScreenView>
      <Header title="SignUp" />
      <ThemedText>username</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" // 자동 대문자 막기
      />
      <ThemedTextButton onPress={signup}>가입하기</ThemedTextButton>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
