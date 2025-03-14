import { StyleSheet, View, ViewStyle } from "react-native";
import ThemedModal from "./ThemedModal";

type ScreenViewProps = {
  children: React.ReactNode;
  style?: ViewStyle;
} & React.ComponentProps<typeof View>;

export default function ScreenView({
  children,
  style,
  ...props
}: ScreenViewProps) {
  return (
    <View style={StyleSheet.flatten([styles.container, style])} {...props}>
      {children}
      <ThemedModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
