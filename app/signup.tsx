import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import {
  firestoreAddUser,
  firestoreFindUser,
  firestoreGetUser,
} from "@/utils/api";
import { User } from "@/utils/types";
import { param2string } from "@/utils/utils";

import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import { Colors } from "@/utils/Colors";
import ThemedTextInput from "@/components/Common/ThemedTextInput";
import ThemedCheckbox from "@/components/Common/ThemedCheckbox";
import TermsOfUseView from "@/components/Common/TermsOfUseView";
import { modalState } from "@/atoms/modalAtom";

export default function SignupScreen() {
  const [isAgreed, setIsAgreed] = useState(false);
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
  const setModal = useSetRecoilState(modalState);

  const signup = async () => {
    if (username.length < 2 || username.length > 8) {
      setModal({
        visible: true,
        message: "유저명은 2~8자 사이로 입력해주세요",
      });

      return;
    }

    const usernameRegex = /^(?!.*\s)[가-힣a-zA-Z0-9_.]{2,8}$/;
    if (!usernameRegex.test(username)) {
      setModal({
        visible: true,
        message: "올바른 유저명을 입력해주세요.",
      });
      return;
    }

    try {
      const userExisting = await firestoreFindUser(username);
      if (userExisting) {
        setModal({
          visible: true,
          message: `'${username}'는 이미 사용중입니다.`,
        });
        return;
      } else {
        const newUser: User = {
          uid,
          email,
          username,
          isAgreed,
          photo,
          createdAt: Date.now(),
        };

        await firestoreAddUser(newUser);
        setUser(newUser);
        router.replace("/home");
      }
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  return (
    <ScreenView>
      <Header title="회원가입" />
      <View style={styles.container}>
        <View style={{ flex: 1, gap: 4 }}>
          <ThemedText size="small" color="gray">
            이용약관
          </ThemedText>
          <TermsOfUseView />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsAgreed((prev) => !prev);
              }}
              activeOpacity={1}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedCheckbox
                  value={isAgreed}
                  onValueChange={setIsAgreed}
                  size="small"
                  color="orange"
                />
                <ThemedText size="small" color="gray">
                  위 이용약관에 동의합니다
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ThemedTextInput
          placeholder="유저명 입력"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none" // 자동 대문자 막기
        />
        <ThemedTextButton
          disabled={!isAgreed || username == ""}
          onPress={signup}
          type="fill"
          color={username && isAgreed ? "orange" : "gray"}
          buttonStyle={{ width: "100%" }}
        >
          가입하기
        </ThemedTextButton>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    padding: 16,
    gap: 8,
  },
});
