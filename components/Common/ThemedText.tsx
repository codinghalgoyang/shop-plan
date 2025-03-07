import { Colors } from "@/utils/Colors";
import { FONT_SIZE, FontSize, FontWeight } from "@/utils/Shapes";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

export type ThemedTextColor = "black" | "gray" | "blue";

interface ThemedTextProps extends React.ComponentProps<typeof Text> {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[] | undefined;
  color?: ThemedTextColor;
  size?: FontSize;
  weight?: FontWeight;
  bgGray?: boolean;
}

export default function ThemedText({
  children,
  style,
  color = "black",
  size = "normal",
  weight = "normal",
  bgGray = false,
  ...props
}: ThemedTextProps) {
  const baseTextStyle: StyleProp<TextStyle> = {
    color:
      !bgGray && color == "black"
        ? Colors.content.black
        : bgGray && color == "black"
        ? Colors.content.bgGray.black
        : !bgGray && color == "gray"
        ? Colors.content.gray
        : bgGray && color == "gray"
        ? Colors.content.bgGray.gray
        : Colors.blue,
    fontSize:
      size == "small"
        ? FONT_SIZE.small
        : size == "normal"
        ? FONT_SIZE.normal
        : FONT_SIZE.big,
    fontWeight: weight,
  };

  return (
    <Text style={[baseTextStyle, style]} {...props}>
      {children}
    </Text>
  );
}
