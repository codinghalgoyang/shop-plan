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

export type ThemedTextButtonColor = "black" | "gray" | "blue" | "orange";
export type ThemedTextButtonType = "plain" | "outline" | "fill";

interface ThemedTextButtonProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  children: React.ReactNode;
  buttonStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  color?: ThemedTextButtonColor;
  size?: FontSize;
  weight?: FontWeight;
  bgGray?: boolean;
  type?: ThemedTextButtonType;
}

export default function ThemedTextButton({
  children,
  buttonStyle,
  textStyle,
  color = "black",
  size = "normal",
  weight = "normal",
  bgGray = false,
  type = "plain",
  ...props
}: ThemedTextButtonProps) {
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
    fontWeight: weight,
  };

  const baseViewStyle: StyleProp<ViewStyle> = {
    borderWidth: type == "outline" ? 0.5 : 0,
    borderColor: mainColor,
    backgroundColor: type == "fill" ? mainColor : undefined,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    // View로 감싸줘야 TouchableOpacity의 너비가 조정됨.
    <View style={styles.wrapper} key={props.key}>
      <TouchableOpacity style={[baseViewStyle, buttonStyle]} {...props}>
        <Text style={[baseTextStyle, textStyle]}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center", // 이게 있어야 아래 TouchableOpacity의 너비가 콘텐츠에 맞춰지고 없으면, fullwidth가 됨
  },
});
