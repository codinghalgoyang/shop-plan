import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { RecoilRoot } from "recoil";

export default function RootLayout() {
  return (
    <RecoilRoot>
      <SafeAreaView style={styles.container}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="home"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="plan"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="add_plan"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modify_plan"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="error"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="signup"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="setting"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaView>
    </RecoilRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
