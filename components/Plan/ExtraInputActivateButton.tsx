import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface ExtraInputActivateButtonProps {
  iconName: "tag" | "link";
}

export default function ExtraInputActivateButton({
  iconName,
}: ExtraInputActivateButtonProps) {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Feather
          name={iconName}
          style={
            iconName == "link"
              ? { ...styles.icon, ...styles.iconReverse }
              : styles.icon
          }
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 26,
  },
  iconReverse: {
    transform: [{ scaleX: -1 }],
  },
});
