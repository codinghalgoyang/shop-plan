import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Colors } from "@/utils/Colors";
import ThemedText from "./ThemedText";
import ThemedIcon from "./ThemedIcon";
import React from "react";
import ThemedIconButton from "./ThemedIconButton";

export type HeaderColor = "white" | "orange";

interface HeaderProps extends React.ComponentProps<typeof View> {
  title: string;
  enableBackAction?: boolean;
  color?: HeaderColor;
  onBack?: () => void;
}

export default function Header({
  title,
  enableBackAction,
  color = "white",
  onBack,
  children,
}: HeaderProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            color === "white" ? Colors.background.white : Colors.orange,
        },
      ]}
    >
      <View style={styles.titleContainer}>
        {enableBackAction && (
          <ThemedIconButton
            IconComponent={Ionicons}
            iconName="arrow-back"
            onPress={() => {
              if (onBack) {
                onBack();
              } else {
                router.back();
              }
            }}
            size="big"
            color={color === "orange" ? "white" : "black"}
          />
        )}
        <ThemedText
          size="big"
          weight="bold"
          style={!enableBackAction ? { marginLeft: 15 } : undefined}
          numberOfLines={1}
          color={color === "orange" ? "white" : "black"}
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
    borderBottomWidth: 0.5,
    borderColor: Colors.border,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.8,
  },
  actionsContainer: {
    flexDirection: "row",
  },
});
