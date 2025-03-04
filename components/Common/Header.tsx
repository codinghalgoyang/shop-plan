import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Colors } from "@/utils/Colors";
import ThemedText from "./ThemedText";
import ThemedIcon from "./ThemedIcon";
import React from "react";

interface HeaderProps extends React.ComponentProps<typeof View> {
  title: string;
  enableBackAction?: boolean;
}

export default function Header({
  title,
  enableBackAction,
  children,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {enableBackAction && (
          <ThemedIcon
            IconComponent={Ionicons}
            iconName="arrow-back"
            onPress={() => {
              router.back();
            }}
          />
        )}
        <ThemedText
          style={
            !enableBackAction
              ? { ...styles.title, marginLeft: 15 }
              : styles.title
          }
        >
          {title.toUpperCase()}
        </ThemedText>
      </View>
      <View style={styles.actionsContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
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
    fontSize: 22, // 제목 텍스트 크기
    fontWeight: 600,
  },
  actionsContainer: {
    flexDirection: "row",
  },
});
