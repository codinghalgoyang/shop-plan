import { StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import ThemedIcon from "../Common/ThemedIcon";

interface ExtraInputActivateButtonProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export default function ExtraInputActivateButton({
  enabled,
  setEnabled,
}: ExtraInputActivateButtonProps) {
  return (
    <ThemedIcon
      IconComponent={AntDesign}
      iconName="up"
      style={
        enabled ? { fontSize: 26 } : { fontSize: 26, ...styles.iconReverse }
      }
      onPress={() => {
        setEnabled(!enabled);
      }}
    />
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
