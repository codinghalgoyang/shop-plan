import { StyleSheet, TouchableOpacity, View } from "react-native";
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
      <View style={styles.icon}>
        <AntDesign name="pluscircle" size={52} color={Colors.orange} />
      </View>
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
  icon: {
    backgroundColor: Colors.background.white,
    borderRadius: 26,
  },
});
