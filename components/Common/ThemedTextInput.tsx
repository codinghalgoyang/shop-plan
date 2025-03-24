import { Colors } from "@/utils/Colors";
import { FONT_SIZE } from "@/utils/Shapes";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

interface ThemedTextInputProps extends React.ComponentProps<typeof TextInput> {}

export default function ThemedTextInput({
  children,
  style,
  ...props
}: ThemedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <TextInput
      style={[styles.input, isFocused && styles.inputFocused, style]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholderTextColor={Colors.content.bgGray.gray}
      numberOfLines={1}
      {...props}
    >
      {children}
    </TextInput>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: FONT_SIZE.normal,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: Colors.background.gray,
    color: Colors.content.bgGray.black,
  },
  inputFocused: {
    borderColor: Colors.orange,
  },
});
