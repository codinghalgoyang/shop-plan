import { Colors } from "@/utils/Colors";
import { StyleSheet, Text, View, ViewProps, ViewStyle } from "react-native";

interface SettingItemProps extends ViewProps {
  style?: ViewStyle;
  icon?: React.ReactNode;
  title: string | undefined;
  action: React.ReactNode;
}

export default function SettingItem({
  style,
  icon,
  title,
  action,
}: SettingItemProps) {
  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <View style={styles.titleContainer}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 18,
    // color: Colors.disabled,
  },
});
