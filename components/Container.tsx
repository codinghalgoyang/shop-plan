import { Colors } from "@/contants/Colors";
import { StyleSheet, View, ViewStyle } from "react-native";

type ContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function Container({ children, style }: ContainerProps) {
  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
});
