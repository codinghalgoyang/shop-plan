import { Colors } from "@/utils/Colors";
import {
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
}

export default function ThemedTextButton({
  children,
  buttonStyle,
  textStyle,
  ...props
}: ThemedTextButtonProps) {
  return (
    // View로 감싸줘야 TouchableOpacity의 너비가 조정됨.
    <View style={styles.wrapper}>
      <TouchableOpacity style={[styles.button, buttonStyle]} {...props}>
        <Text style={[styles.text, textStyle]}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center", // 이게 있어야 아래 TouchableOpacity의 너비가 콘텐츠에 맞춰지고 없으면, fullwidth가 됨
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: Colors.content.white, fontSize: 16 },
});
