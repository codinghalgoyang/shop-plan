import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Colors } from "@/utils/Colors";
import ThemedText from "./ThemedText";
import ThemedIcon from "./ThemedIcon";
import React from "react";
import ThemedIconButton from "./ThemedIconButton";

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
          <ThemedIconButton
            IconComponent={Ionicons}
            iconName="arrow-back"
            onPress={() => {
              router.back();
            }}
            size="big"
          />
        )}
        <ThemedText
          size="big"
          weight="bold"
          style={!enableBackAction ? { marginLeft: 15 } : undefined}
        >
          {title}
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
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
  },
});
