import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface SettingItemGroupProps {
  title: string;
  children?: React.ReactNode;
}

export default function SettingItemGroup({
  title,
  children,
}: SettingItemGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    paddingLeft: 5,
  },
});
