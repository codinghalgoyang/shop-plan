import { Colors } from "@/utils/Colors";
import { Sizes } from "@/utils/Sizes";
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
      placeholderTextColor={Colors.content.placeholder}
      {...props}
    >
      {children}
    </TextInput>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: Sizes.normal,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: Colors.background.lightGray,
    color: Colors.content.primary,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
});
