import { StyleSheet, View, Text } from "react-native";
import HeaderAction from "./HeaderAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Colors } from "@/utils/Colors";

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
        <Text style={[styles.title, !enableBackAction && styles.titleMargin]}>
          {title.toUpperCase()}
        </Text>
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
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24, // 제목 텍스트 크기
    fontWeight: 600,
  },
  titleMargin: {
    marginLeft: 12,
  },
});
