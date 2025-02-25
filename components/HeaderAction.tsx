import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface HeaderActionProps {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  onPress: () => void;
}

export default function HeaderAction({
  IconComponent,
  iconName,
  onPress,
}: HeaderActionProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <IconComponent name={iconName} size={28} color="black" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
});
