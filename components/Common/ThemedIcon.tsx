import { Colors } from "@/utils/Colors";
import { StyleSheet, TextStyle, TouchableOpacity, View } from "react-native";

interface ThemedIconProps {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  style?: TextStyle | TextStyle[];
  onPress?: () => void;
}

export default function ThemedIcon({
  IconComponent,
  iconName,
  style,
  onPress,
}: ThemedIconProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <IconComponent name={iconName} style={[styles.icon, style]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    color: Colors.content.black,
  },
});
