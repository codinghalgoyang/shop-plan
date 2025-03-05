import { Colors } from "@/utils/Colors";
import { Size, Sizes } from "@/utils/Sizes";
import { StyleSheet, Text, TextStyle } from "react-native";

interface ThemedTextProps extends React.ComponentProps<typeof Text> {
  size?: Size;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[] | undefined;
}

export default function ThemedText({
  size = "normal",
  children,
  style,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      style={[
        {
          fontSize:
            size == "small"
              ? Sizes.small
              : size == "big"
              ? Sizes.big
              : Sizes.normal,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { color: Colors.content.primary, fontSize: Sizes.normal },
});
