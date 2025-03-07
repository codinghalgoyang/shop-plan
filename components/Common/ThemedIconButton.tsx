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

export type ThemedIconButtonColor = "black" | "gray" | "blue" | "orange";
export type ThemedIconButtonType = "plain" | "outline" | "fill";

interface ThemedIconButtonProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  style?: ViewStyle | ViewStyle[];
  color?: ThemedIconButtonColor;
  size?: FontSize;
  bgGray?: boolean;
  type?: ThemedIconButtonType;
}

export default function ThemedIconButton({
  IconComponent,
  iconName,
  style,
  color = "black",
  size = "normal",
  bgGray = false,
  type = "plain",
  ...props
}: ThemedIconButtonProps) {
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

  const baseTextStyle: StyleProp<TextStyle> = {
    color: type == "fill" ? Colors.content.white : mainColor,
    fontSize:
      size == "small"
        ? FONT_SIZE.small
        : size == "normal"
        ? FONT_SIZE.normal
        : FONT_SIZE.big,
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
      <IconComponent name={iconName} style={baseTextStyle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
