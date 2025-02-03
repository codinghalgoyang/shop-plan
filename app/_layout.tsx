import { Stack } from "expo-router";
import { RecoilRoot } from "recoil";

export default function RootLayout() {
  return (
    <RecoilRoot>
      <Stack>
        <Stack.Screen
          name="home"
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
      </Stack>
    </RecoilRoot>
  );
}
