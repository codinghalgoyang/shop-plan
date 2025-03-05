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

export type ThemedTextButtonType = "normal" | "outline" | "primary";

export default function ThemedTextButton({
  children,
  buttonStyle,
  textStyle,
  size = "normal",
  type = "normal",
  ...props
}: ThemedTextButtonProps) {
  const baseTextStyle: StyleProp<TextStyle> = {
    color: type == "outline" ? Colors.content.primary : Colors.content.white,
    fontSize: size == "big" ? Sizes.normal : Sizes.small,
    fontWeight: size == "big" ? 600 : 400,
  };

  const baseViewStyle: StyleProp<ViewStyle> = {
    borderWidth: type == "outline" ? 0.5 : 0,
    borderColor: Colors.content.primary,
    backgroundColor:
      type == "normal"
        ? Colors.background.black
        : type == "primary"
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
