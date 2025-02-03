import { StyleSheet, Text, View } from "react-native";

export default function ErrorScreen() {
  return (
    <View style={styles.container}>
      <Text>Error Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
