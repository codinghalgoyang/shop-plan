import { Colors } from "@/contants/Colors";
import { StyleSheet, View, ViewStyle } from "react-native";

type ContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
} & React.ComponentProps<typeof View>;

export default function Container({
  children,
  style,
  ...props
}: ContainerProps) {
  return (
    <View style={StyleSheet.flatten([styles.container, style])} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
});
