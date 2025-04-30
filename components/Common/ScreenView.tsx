import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import ThemedModal from "./ThemedModal";
import { HEADER_HEIGHT } from "@/utils/Shapes";

type ScreenViewProps = {
  children: React.ReactNode;
  style?: ViewStyle;
} & React.ComponentProps<typeof View>;

export default function ScreenView({
  children,
  style,
  ...props
}: ScreenViewProps) {
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView
        behavior={"padding"} // iOS에서는 'padding' 또는 'position', Android는 'height'가 일반적
        style={styles.container}
        keyboardVerticalOffset={HEADER_HEIGHT}
        // keyboardVerticalOffset={헤더 높이 등 필요에 따라 조정}
      >
        <View style={StyleSheet.flatten([styles.container, style])} {...props}>
          {children}
          <ThemedModal />
        </View>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <View style={StyleSheet.flatten([styles.container, style])} {...props}>
        {children}
        <ThemedModal />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
