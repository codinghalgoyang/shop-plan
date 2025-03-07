import { Colors } from "@/utils/Colors";
import { FONT_SIZE, FontSize, FontWeight } from "@/utils/Shapes";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type ThemedIconButtonColor = "black" | "gray" | "blue" | "orange";

interface ThemedIconProps extends React.ComponentProps<typeof Text> {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  style?: TextStyle | TextStyle[] | undefined;
  color?: ThemedIconButtonColor;
  size?: FontSize;
  bgGray?: boolean;
}

export default function ThemedIconButton({
  IconComponent,
  iconName,
  style,
  color = "black",
  size = "normal",
  bgGray,
  ...props
}: ThemedIconProps) {
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
  };

  return (
    <IconComponent name={iconName} style={[baseTextStyle, style]} {...props} />
  );
}
