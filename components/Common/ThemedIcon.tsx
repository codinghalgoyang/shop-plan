import { Colors } from "@/utils/Colors";
import { Size, Sizes } from "@/utils/Sizes";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

interface ThemedIconProps {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  onPress?: () => void;
  size?: Size;
  padding?: boolean;
  style?: TextStyle | TextStyle[];
}

export default function ThemedIcon({
  IconComponent,
  iconName,
  onPress,
  size = "normal",
  padding = false,
  style,
}: ThemedIconProps) {
  const iconStyle: StyleProp<TextStyle> = {
    color: Colors.content.black,
    padding: padding ? 12 : 0,
    fontSize:
      size == "small" ? Sizes.small : size == "big" ? Sizes.big : Sizes.normal,
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <IconComponent name={iconName} style={[iconStyle, style]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
