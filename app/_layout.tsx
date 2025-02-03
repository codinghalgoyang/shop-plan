import { Stack } from "expo-router";
import { RecoilRoot } from "recoil";

export default function RootLayout() {
  return (
    <RecoilRoot>
      <Stack />
    </RecoilRoot>
  );
}
