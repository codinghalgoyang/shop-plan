import {
  BackHandler,
  StyleSheet,
  View,
  StatusBar,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Colors } from "@/utils/Colors";
import ThemedText from "./ThemedText";
import ThemedIcon from "./ThemedIcon";
import React, { useEffect } from "react";
import ThemedIconButton from "./ThemedIconButton";

export type HeaderColor = "white" | "orange" | "black";

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
  useEffect(() => {
    const backAction = () => {
      if (onBack) {
        onBack();
        return true; // 이벤트 전파를 막음
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            color === "white"
              ? Colors.background.white
              : color === "orange"
              ? Colors.orange
              : Colors.background.black,
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
            color={color === "white" ? "black" : "white"}
          />
        )}
        <ThemedText
          size="big"
          weight="bold"
          style={!enableBackAction ? { marginLeft: 15 } : undefined}
          numberOfLines={1}
          color={color === "white" ? "black" : "white"}
        >
          {title}
        </ThemedText>
      </View>
      <View style={styles.actionsContainer}>{children}</View>
      <StatusBar
        backgroundColor={
          color === "orange"
            ? Colors.orange
            : color === "black"
            ? Colors.background.black
            : Colors.background.white
        }
        barStyle={color === "white" ? "dark-content" : "light-content"}
      />
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
