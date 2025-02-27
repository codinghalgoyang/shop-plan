import { StyleSheet, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ExtraInputActivateButtonProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export default function ExtraInputActivateButton({
  enabled,
  setEnabled,
}: ExtraInputActivateButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        setEnabled(!enabled);
      }}
    >
      <View style={styles.container}>
        <AntDesign
          name="up"
          style={
            enabled ? { ...styles.icon, ...styles.iconReverse } : styles.icon
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
    paddingHorizontal: 8,
  },
  icon: {
    fontSize: 26,
  },
  iconReverse: {
    transform: [{ scaleY: -1 }],
  },
});
