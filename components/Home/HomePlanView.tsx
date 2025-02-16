import { plansState } from "@/atoms/plansAtom";
import { db } from "@/utils/firebaseConfig";
import { Plan } from "@/utils/types";
import { router } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRecoilValue } from "recoil";

interface HomePlanViewProps {
  index: number;
}

export default function HomePlanView({ index }: HomePlanViewProps) {
  const plans = useRecoilValue(plansState);
  const plan = plans[index];

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/plan?index=${index}`);
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{plan.title || "Loading..."}</Text>
        {plan?.planUsers.map((planUser) => (
          <Text key={planUser.uid} style={styles.users}>
            {planUser.username}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderWidth: 1, // 테두리 두께
    borderColor: "black", // 테두리 색상
    padding: 10,
  },
  title: {
    fontSize: 24,
  },
  users: {
    fontSize: 18,
  },
});
