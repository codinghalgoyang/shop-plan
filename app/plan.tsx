import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { db } from "@/utils/firebaseConfig";
import { Plan } from "@/utils/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

export default function PlanScreen() {
  const { planId } = useLocalSearchParams();
  const [plan, setPlan] = useState<Plan>();

  // subscribe planDoc
  useEffect(() => {
    const planDocRef = doc(
      db,
      "Plans",
      Array.isArray(planId) ? planId[0] : planId
    );
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
      <Text>PlanScreen : {plan?.title}</Text>
    </ScreenView>
  );
}
