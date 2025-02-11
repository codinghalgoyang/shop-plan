import Header from "@/components/Header";
import ScreenView from "@/components/ScreenView";
import { Text } from "react-native";

export default function AddPlanScreen() {
  return (
    <ScreenView>
      <Header title="AddPlan" enableBackAction />
      <Text>Add Plan</Text>
    </ScreenView>
  );
}
