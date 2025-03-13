import Header from "@/components/Common/Header";
import { StyleSheet, View } from "react-native";
import ScreenView from "@/components/Common/ScreenView";
import TermsOfUseView from "@/components/Common/TermsOfUseView";
import { Colors } from "@/utils/Colors";

export default function TermsOfUseSreen() {
  return (
    <ScreenView>
      <Header title="이용약관" enableBackAction={true} />
      <TermsOfUseView />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
    backgroundColor: Colors.background.lightGray,
    padding: 16,
  },
});
