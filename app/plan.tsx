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
import PlanInput from "@/components/Plan/PlanInput";

export default function PlanScreen() {
  const { planId: paramPlanId } = useLocalSearchParams();
  const planId = Array.isArray(paramPlanId) ? paramPlanId[0] : paramPlanId;
  const planDocRef = doc(db, "Plans", planId);
  const [plan, setPlan] = useState<Plan>();

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
        {plan?.items.map((planItem, idx) => (
          <PlanItemView
            key={planItem.title}
            planItem={planItem}
            idx={idx}
            plan={plan}
            planId={planId}
          />
        ))}
        <PlanInput onSubmit={addPlanItem} />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // 상대 포지션 설정
  },
});
