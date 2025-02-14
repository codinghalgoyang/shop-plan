import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { db } from "@/utils/firebaseConfig";
import { Plan } from "@/utils/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import PlanItemView from "@/components/Plan/PlanItemView";

export default function PlanScreen() {
  const { planId: paramPlanId } = useLocalSearchParams();
  const planId = Array.isArray(paramPlanId) ? paramPlanId[0] : paramPlanId;
  const planDocRef = doc(db, "Plans", planId);
  const [plan, setPlan] = useState<Plan>();
  const [text, setText] = useState("");

  const addPlanItem = async (text: string) => {
    if (!plan) return;

    try {
      // 수정할 데이터
      const updatedPlan: Plan = {
        ...plan,
        items: [
          ...plan.items,
          { checked: false, title: text, category: null, link: null },
        ],
      } as Plan;

      await updateDoc(planDocRef, updatedPlan);
      console.log("문서가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("문서 수정 중 오류 발생:", error);
    }
  };

  const handleInputChange = (input: string) => {
    setText(input);
  };

  const handleSubmit = () => {
    console.log("입력한 텍스트:", text);
    addPlanItem(text);
    setText(""); // 입력 필드 초기화
  };

  // subscribe planDoc
  useEffect(() => {
    const unsubscribe = onSnapshot(
      planDocRef,
      (planDoc) => {
        if (planDoc.exists()) {
          const newPlan = planDoc.data() as Plan;
          setPlan(newPlan);
        } else {
          console.log("No such plan : ", planId);
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <ScreenView>
      <Header title={plan ? plan.title : "Loading..."} enableBackAction />
      <View style={styles.container}>
        {plan?.items.map((planItem) => (
          <PlanItemView key={planItem.title} planItem={planItem} />
        ))}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={handleInputChange}
            placeholder="여기에 입력하세요"
            onSubmitEditing={handleSubmit}
          />
          <Button title="ADD" onPress={handleSubmit} />
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // 상대 포지션 설정
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
});
