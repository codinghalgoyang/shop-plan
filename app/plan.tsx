import ScreenView from "@/components/ScreenView";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function PlanScreen() {
  const { planId } = useLocalSearchParams();
  return (
    <ScreenView>
      <Text>PlanScreen : {planId}</Text>
    </ScreenView>
  );
}
