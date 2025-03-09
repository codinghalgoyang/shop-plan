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
import { useState } from "react";

interface ThemedCheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ThemedCheckbox({
  value,
  onValueChange,
}: ThemedCheckboxProps) {
  const backgroundColor = value ? Colors.orange : Colors.background.gray;
  const color = value ? Colors.content.white : Colors.content.bgGray.gray;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onValueChange(!value);
      }}
    >
      <View style={[styles.checkbox, { backgroundColor: backgroundColor }]}>
        <AntDesign name="check" style={[styles.check, { color: color }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  checkbox: {
    padding: 4,
    backgroundColor: Colors.background.gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2.5,
  },
  check: {
    fontSize: FONT_SIZE.small,
    color: Colors.content.bgGray.gray,
  },
});
