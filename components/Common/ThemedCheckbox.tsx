import { Colors } from "@/utils/Colors";
import { FONT_SIZE, FontSize } from "@/utils/Shapes";
import { StyleSheet, TouchableOpacity, View, Vibration } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

type ThemedCheckboxColor = "blue" | "orange";

interface ThemedCheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: FontSize;
  color?: ThemedCheckboxColor;
  disabled?: boolean;
}

export default function ThemedCheckbox({
  value,
  onValueChange,
  size = "normal",
  color = "orange",
  disabled = false,
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
      style={{ padding: size == "small" ? 8 : size == "normal" ? 12 : 24 }}
      onPress={() => {
        Vibration.vibrate(25);
        onValueChange(!value);
      }}
      activeOpacity={1}
      disabled={disabled}
    >
      <View style={[styles.checkbox, { backgroundColor: backgroundColor }]}>
        <AntDesign name="check" style={[styles.check, { color: checkColor }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
