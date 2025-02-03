import { StyleSheet, View, Text } from "react-native";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22, // 제목 텍스트 크기
    fontWeight: "bold",
  },
});
