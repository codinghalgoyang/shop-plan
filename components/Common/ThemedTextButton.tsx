import { Colors } from "@/utils/Colors";
import { Size, Sizes } from "@/utils/Sizes";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ThemedTextButtonProps
  extends React.ComponentProps<typeof TouchableOpacity> {
  children: React.ReactNode;
  buttonStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  size?: Size;
  type?: ThemedTextButtonType;
}

export type ThemedTextButtonType =
  | "plain"
  | "plainBlue"
  | "outline"
  | "bgBlack"
  | "bgPrimary";

export default function ThemedTextButton({
  children,
  buttonStyle,
  textStyle,
  size = "normal",
  type = "plain",
  ...props
}: ThemedTextButtonProps) {
  const baseTextStyle: StyleProp<TextStyle> = {
    color:
      type == "plain" || type == "outline"
        ? Colors.content.primary
        : type == "plainBlue"
        ? Colors.blue
        : Colors.content.white,
    fontSize:
      size == "small"
        ? Sizes.small
        : size == "normal"
        ? Sizes.normal
        : Sizes.big,
  };

  const baseViewStyle: StyleProp<ViewStyle> = {
    borderWidth: type == "outline" ? 0.5 : 0,
    borderColor: Colors.content.primary,
    backgroundColor:
      type == "plain"
        ? undefined
        : type == "bgBlack"
        ? Colors.background.black
        : type == "bgPrimary"
        ? Colors.primary
        : Colors.background.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    // View로 감싸줘야 TouchableOpacity의 너비가 조정됨.
    <View style={styles.wrapper}>
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
