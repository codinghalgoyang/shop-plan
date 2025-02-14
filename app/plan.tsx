import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function PlanScreen() {
  const { planId } = useLocalSearchParams();
  return (
    <ScreenView>
      <Header title="Plan" enableBackAction />
      <Text>PlanScreen : {planId}</Text>
    </ScreenView>
  );
}
