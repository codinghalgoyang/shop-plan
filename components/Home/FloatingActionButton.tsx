import { StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/utils/Colors";

interface FloatingActionButtionProps {
  onPress: () => void;
}

export default function FloatingActionButtion({
  onPress,
}: FloatingActionButtionProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <AntDesign name="pluscircle" size={54} color={Colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
