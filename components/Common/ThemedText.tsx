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
          fontWeight: size == "big" ? 600 : 400,
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
  text: { color: Colors.content.black, fontSize: Sizes.normal },
});
