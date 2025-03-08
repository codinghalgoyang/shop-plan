import { Colors } from "@/utils/Colors";
import { StyleSheet, View, ViewStyle } from "react-native";

interface PaperProps extends React.ComponentProps<typeof View> {
  style?: ViewStyle;
}

export default function Paper({ children, style, ...props }: PaperProps) {
  return (
    <View style={StyleSheet.flatten([styles.container, style])} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.white,
    borderRadius: 5,
  },
});
