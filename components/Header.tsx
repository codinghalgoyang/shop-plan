import { StyleSheet, View, Text } from "react-native";

interface HeaderProps {
  title: string;
  actions?: React.ReactNode[];
}

export default function Header({ title, actions }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actions?.map((action) => action)}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22, // 제목 텍스트 크기
    fontWeight: "bold",
  },
});
