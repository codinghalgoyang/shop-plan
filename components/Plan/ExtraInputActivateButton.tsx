import { StyleSheet } from "react-native";
import ThemedIconButton from "../Common/ThemedIconButton";
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
    <ThemedIconButton
      IconComponent={AntDesign}
      iconName={!enabled ? "plus" : "minus"}
      color="gray"
      onPress={() => {
        setEnabled(!enabled);
      }}
      style={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    paddingVertical: 8,
  },
});
