import { plansState } from "@/atoms/plansAtom";
import { userState } from "@/atoms/userAtom";
import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import {
  firestoreEscapePlan,
  firestoreRemovePlan,
  firestoreUpdatePlan,
} from "@/utils/api";
import { Plan, PlanUser } from "@/utils/types";
import { param2string } from "@/utils/utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Button, Keyboard } from "react-native";

import { useRecoilValue, useSetRecoilState } from "recoil";
import ThemedText from "@/components/Common/ThemedText";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import { Colors } from "@/utils/Colors";
import ThemedTextInput from "@/components/Common/ThemedTextInput";
import EditPlanMembersView from "@/components/EditPlan/EditPlanMembersView";
import { modalState } from "@/atoms/modalAtom";

export default function EditPlanScreen() {
  const setModal = useSetRecoilState(modalState);
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  if (plan === undefined) {
    router.back();
    return null;
  }

  const [title, setTitle] = useState(plan.title);
  const user = useRecoilValue(userState);
  const myPlanUser = plan.planUsers.find(
    (planUser) => planUser.uid === user.uid
  ) ?? { uid: "", username: "Unknown user", isAdmin: false };
  const admins = plan.planUsers.filter((planUser) => planUser.isAdmin);
  const editable = myPlanUser?.isAdmin;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const changeTitle = async () => {
    setModal({
      visible: true,
      message: `플랜 제목을 '${title}' 로 변경하시겠습니까?`,
      onConfirm: async () => {
        const newPlan: Plan = { ...plan };
        newPlan.title = title;
        if (!(await firestoreUpdatePlan(newPlan))) {
          setModal({
            visible: true,
            title: "플랜 제목 변경 실패",
            message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  const removePlan = async () => {
    setModal({
      visible: true,
      message: `정말 '${plan.title}' 플랜을 삭제하시겠습니까?`,
      onConfirm: async () => {
        if (await firestoreRemovePlan(plan.id)) {
          router.back();
        } else {
          setModal({
            visible: true,
            title: "플랜 삭제 실패",
            message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  const escapePlan = async () => {
    setModal({
      visible: true,
      message: `정말 '${plan.title}' 플랜을 나가시겠습니까?`,
      onConfirm: async () => {
        if (await firestoreEscapePlan(plan, user)) {
          router.back();
        } else {
          setModal({
            visible: true,
            title: "플랜 나가기 실패",
            message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
          });
        }
      },
      onCancel: () => {},
    });
  };

  const exitEdit = async () => {
    router.back();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <ScreenView>
      <Header title="플랜 편집" enableBackAction />
      <View style={styles.container}>
        <ThemedText>플랜 제목</ThemedText>
        <View style={styles.titleContainer}>
          <ThemedTextInput
            placeholder="플랜 제목 입력"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="none" // 자동 대문자 막기
            editable={editable}
            style={styles.input}
          />
          {editable && (
            <ThemedTextButton
              disabled={title == plan.title || title == ""}
              onPress={changeTitle}
              color={title == plan.title || title == "" ? "gray" : "blue"}
              type="fill"
            >
              변경
            </ThemedTextButton>
          )}
        </View>
        <ThemedText>사용자</ThemedText>
        <EditPlanMembersView plan={plan} />
        {!isKeyboardOpen && (
          <View style={styles.buttonContainer}>
            {(admins.length > 1 || !myPlanUser.isAdmin) && (
              <ThemedTextButton
                onPress={escapePlan}
                buttonStyle={styles.button}
                weight="bold"
                color="orange"
                type={myPlanUser.isAdmin ? "outline" : "fill"}
              >
                플랜 나가기
              </ThemedTextButton>
            )}
            {myPlanUser.isAdmin && (
              <ThemedTextButton
                onPress={removePlan}
                buttonStyle={styles.button}
                color="orange"
                weight="bold"
                type="fill"
              >
                플랜 삭제하기
              </ThemedTextButton>
            )}
            <ThemedTextButton
              onPress={exitEdit}
              buttonStyle={styles.button}
              color="black"
              type="plain"
            >
              편집 종료
            </ThemedTextButton>
          </View>
        )}
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  input: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 12,
    gap: 8,
  },
  button: {
    width: "100%",
  },
});
