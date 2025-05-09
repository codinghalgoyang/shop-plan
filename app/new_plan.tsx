import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { InvitedPlanUser, PlanUser } from "@/utils/types";
import { router } from "expo-router";
import { userState } from "@/atoms/userAtom";
import { firestoreAddPlan } from "@/utils/api";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedTextInput from "@/components/Common/ThemedTextInput";
import { Colors } from "@/utils/Colors";
import NewPlanMembersView from "@/components/NewPlan/NewPlanMembersView";
import { modalState } from "@/atoms/modalAtom";

export default function NewPlanScreen() {
  const setModal = useSetRecoilState(modalState);
  const user = useRecoilValue(userState);
  const [title, setTitle] = useState("");
  const [invitedPlanUsers, setInvitedPlanUsers] = useState<InvitedPlanUser[]>(
    []
  );
  const myPlanUser: PlanUser = {
    uid: user.uid,
    username: user.username,
    isAdmin: true,
    createdAt: Date.now(),
  };

  const addPlan = async () => {
    if (!user) return;
    if (!title) {
      setModal({
        visible: true,
        title: "안내",
        message: `플랜 제목을 입력해주세요.`,
      });
      return;
    }
    try {
      await firestoreAddPlan(title, [myPlanUser], invitedPlanUsers);
      router.back();
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
      <Header title="새로운 플랜" enableBackAction color="orange" />
      <View style={styles.container}>
        <ThemedText>플랜 제목</ThemedText>
        <ThemedTextInput
          placeholder="플랜 제목 입력"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="none" // 자동 대문자 막기
          style={styles.titleInput}
        />
        <ThemedText>멤버 초대</ThemedText>
        <NewPlanMembersView
          myPlanUser={myPlanUser}
          invitedPlanUsers={invitedPlanUsers}
          setInvitedPlanUsers={setInvitedPlanUsers}
        />
        <ThemedTextButton
          onPress={addPlan}
          buttonStyle={styles.button}
          color={title == "" ? "gray" : "orange"}
          disabled={title == ""}
          weight="bold"
          type="fill"
        >
          플랜 만들기
        </ThemedTextButton>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.lightGray,
    padding: 12,
    gap: 12,
    flex: 1,
  },
  titleInput: {
    width: "100%",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
  },
});
