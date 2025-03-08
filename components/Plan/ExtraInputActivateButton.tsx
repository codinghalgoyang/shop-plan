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
      // padding={false}
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
    paddingVertical: 8,
  },
});
