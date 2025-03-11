import { Colors } from "@/utils/Colors";
import { FONT_SIZE, FontSize, FontWeight } from "@/utils/Shapes";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type ThemedCheckboxColor = "blue" | "orange";

interface ThemedCheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: FontSize;
  color?: ThemedCheckboxColor;
}

export default function ThemedCheckbox({
  value,
  onValueChange,
  size = "normal",
  color = "orange",
}: ThemedCheckboxProps) {
  const backgroundColor =
    color == "orange" && value
      ? Colors.orange
      : color == "blue" && value
      ? Colors.blue
      : Colors.background.gray;
  const checkColor = value ? Colors.content.white : Colors.content.bgGray.gray;

  return (
    <TouchableOpacity
      style={{ padding: size == "small" ? 8 : size == "normal" ? 16 : 24 }}
      onPress={() => {
        onValueChange(!value);
      }}
    >
      <View style={[styles.checkbox, { backgroundColor: backgroundColor }]}>
        <AntDesign name="check" style={[styles.check, { color: checkColor }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  checkbox: {
    padding: 4,
    backgroundColor: Colors.background.gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2.5,
  },
  check: {
    fontSize: FONT_SIZE.normal,
    color: Colors.content.bgGray.gray,
  },
});
