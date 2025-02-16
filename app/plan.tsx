import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { db } from "@/utils/firebaseConfig";
import { Plan } from "@/utils/types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import { param2string } from "@/utils/utils";
import { useRecoilValue } from "recoil";
import { plansState } from "@/atoms/plansAtom";

export default function PlanScreen() {
  const { index: paramIndex } = useLocalSearchParams();
  const index = parseInt(param2string(paramIndex));
  const plans = useRecoilValue(plansState);
  const plan = plans[index];

  return (
    <ScreenView>
      <Header title={plan ? plan.title : "Loading..."} enableBackAction />
      <View style={styles.container}>
        <ScrollView style={styles.listContainer}>
          {plan?.items.map((planItem, itemIdx) => (
            <PlanItemView key={planItem.title} plan={plan} itemIdx={itemIdx} />
          ))}
        </ScrollView>
        <PlanInput plan={plan} />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
});
