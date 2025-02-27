import ScreenView from "@/components/Common/ScreenView";
import { StyleSheet, Text, View } from "react-native";

export default function ErrorScreen() {
  return (
    <ScreenView>
      <Text>Error Screen</Text>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
