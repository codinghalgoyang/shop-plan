import { db } from "@/utils/firebaseConfig";
import { Plan, PlanItem } from "@/utils/types";
import Checkbox from "expo-checkbox";
import {
  doc,
  DocumentData,
  DocumentReference,
  updateDoc,
} from "firebase/firestore";

import React from "react";
import { StyleSheet, View, Text, Switch } from "react-native";

interface PlanItemViewProps {
  planItem: PlanItem;
  idx: number;
  plan: Plan;
  planId: string;
}

export default function PlanItemView({
  planItem,
  idx,
  plan,
  planId,
}: PlanItemViewProps) {
  const planDocRef = doc(db, "Plans", planId);
  const onCheckedChange = async (checked: boolean) => {
    try {
      // 수정할 데이터
      const updatedPlan: Plan = {
        ...plan,
      } as Plan;
      updatedPlan.items[idx].checked = checked;

      await updateDoc(planDocRef, updatedPlan);
    } catch (error) {
      console.error("문서 수정 중 오류 발생:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Checkbox
        style={styles.checkbox}
        value={planItem.checked}
        onValueChange={onCheckedChange}
      />
      <Text style={styles.title}>{planItem.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 10,
    gap: 10,
  },
  title: {
    fontSize: 18,
  },
  checkbox: {
    width: 40,
    height: 40,
  },
});
