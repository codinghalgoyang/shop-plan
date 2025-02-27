import { Colors } from "@/utils/Colors";
import { StyleSheet, Text, TextStyle } from "react-native";

interface ThemedTextProps extends React.ComponentProps<typeof Text> {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

export default function ThemedText({
  children,
  style,
  ...props
}: ThemedTextProps) {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { color: Colors.content.black },
});
