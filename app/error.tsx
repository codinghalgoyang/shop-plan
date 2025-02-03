import Container from "@/components/Container";
import { StyleSheet, Text, View } from "react-native";

export default function ErrorScreen() {
  return (
    <Container style={styles.container}>
      <Text>Error Screen</Text>
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
