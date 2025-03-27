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
import ThemedText from "./ThemedText";

export type ThemedIconTextButtonColor = "black" | "gray" | "blue" | "orange";
export type ThemedIconTextButtonType = "plain" | "outline" | "fill";

interface ThemedIconTextButtonProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  title: string;
  style?: ViewStyle | ViewStyle[];
  color?: ThemedIconTextButtonColor;
  size?: FontSize;
  bgGray?: boolean;
  type?: ThemedIconTextButtonType;
}

export default function ThemedIconTextButton({
  IconComponent,
  iconName,
  title,
  style,
  color = "black",
  size = "normal",
  bgGray = false,
  type = "plain",
  ...props
}: ThemedIconTextButtonProps) {
  const mainColor =
    bgGray && color == "black"
      ? Colors.content.bgGray.black
      : bgGray && color == "gray"
      ? Colors.content.bgGray.gray
      : !bgGray && color == "black"
      ? Colors.content.black
      : !bgGray && color == "gray"
      ? Colors.content.gray
      : color == "blue"
      ? Colors.blue
      : Colors.orange;

  const baseIconStyle: StyleProp<TextStyle> = {
    color: type == "fill" ? Colors.content.white : mainColor,
    fontSize:
      size == "small"
        ? FONT_SIZE.small
        : size == "normal"
        ? FONT_SIZE.normal
        : FONT_SIZE.big,
  };

  const baseTextStyle: StyleProp<TextStyle> = {
    color: type == "fill" ? Colors.content.white : mainColor,
    fontSize:
      size == "small"
        ? FONT_SIZE.small / 2
        : size == "normal"
        ? FONT_SIZE.normal / 2
        : FONT_SIZE.big / 2,
  };

  const baseViewStyle: StyleProp<ViewStyle> = {
    borderWidth: type == "outline" ? 0.5 : 0,
    borderColor: mainColor,
    backgroundColor: type == "fill" ? mainColor : undefined,
    padding: 12,
    borderRadius:
      size == "small"
        ? FONT_SIZE.small / 2
        : size == "normal"
        ? FONT_SIZE.normal / 2
        : FONT_SIZE.big / 2,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <TouchableOpacity style={[baseViewStyle, style]} {...props}>
      <View style={styles.container}>
        <IconComponent name={iconName} style={baseIconStyle} />
        <ThemedText style={baseTextStyle}>{title}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
});
