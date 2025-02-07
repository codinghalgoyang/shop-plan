import { StyleSheet, View, Text } from "react-native";
import HeaderAction from "./HeaderAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  enableBackAction?: boolean;
  actions?: React.ReactNode[];
}

export default function Header({
  enableBackAction,
  title,
  actions,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {enableBackAction && (
          <HeaderAction
            IconComponent={Ionicons}
            iconName="arrow-back"
            onPress={() => {
              router.back();
            }}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actions?.map((action) => action)}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 25, // 제목 텍스트 크기
    fontWeight: "bold",
  },
});
