import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { firestoreAddUser } from "@/utils/api";
import { db } from "@/utils/firebaseConfig";
import { User } from "@/utils/types";
import { param2string } from "@/utils/utils";

import { router, useLocalSearchParams } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, Text, Button, TextInput } from "react-native";
import { useSetRecoilState } from "recoil";

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
      <Text>username</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" // 자동 대문자 막기
      />
      <Button title={"Sign Up"} onPress={signup} />
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
