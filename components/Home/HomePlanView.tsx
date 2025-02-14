import { db } from "@/utils/firebaseConfig";
import { Plan } from "@/utils/types";
import { router } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface HomePlanViewProps {
  planId: string;
}

export default function HomePlanView({ planId }: HomePlanViewProps) {
  const [plan, setPlan] = useState<Plan>();

  // subscribe planDoc
  useEffect(() => {
    const planDocRef = doc(db, "Plans", planId);
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
    <TouchableOpacity
      onPress={() => {
        router.push(`/plan?planId=${planId}`);
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{plan?.title || "Loading..."}</Text>
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
