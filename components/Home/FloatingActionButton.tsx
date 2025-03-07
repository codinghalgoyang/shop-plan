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
      <AntDesign name="pluscircle" size={48} color={Colors.orange} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    padding: 12,
    position: "absolute",
    right: 20,
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
