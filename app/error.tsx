import ScreenView from "@/components/Common/ScreenView";
import ThemedText from "@/components/Common/ThemedText";
import { StyleSheet } from "react-native";

export default function ErrorScreen() {
  return (
    <ScreenView>
      <ThemedText>Error Screen</ThemedText>
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
