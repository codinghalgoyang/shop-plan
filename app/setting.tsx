import Container from "@/components/Container";
import { StyleSheet, Text } from "react-native";

export default function SettingScreen() {
  return (
    <Container style={styles.container}>
      <Text>Setting Screen</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
