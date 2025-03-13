import Paper from "@/components/Common/Paper";
import ThemedText from "@/components/Common/ThemedText";
import { ScrollView, StyleSheet, View } from "react-native";

const TERMS_OF_USE: string[][] = [
  [
    "제1조 (목적)",
    '본 약관은 [앱 이름] (이하 "앱")의 이용 조건 및 절차, 이용자와 앱 간의 권리와 의무, 책임 사항 등을 규정함을 목적으로 합니다.',
  ],

  [
    "제2조 (정의)",
    '1. "이용자"란 본 약관에 동의하고 앱을 이용하는 모든 개인 및 법인을 의미합니다.',
    '2. "서비스"란 앱이 제공하는 쇼핑 리스트 작성 및 관리 기능을 포함한 모든 기능을 의미합니다.',
  ],

  [
    "제3조 (약관의 효력 및 변경)",
    "1. 본 약관은 앱에 공지함으로써 효력을 발생합니다.",
    "2. 앱은 필요에 따라 약관을 변경할 수 있으며, 변경된 약관은 앱에 공지함으로써 효력을 발생합니다.",
  ],

  [
    "제4조 (이용자의 의무)",
    "1. 이용자는 본 약관 및 관련 법규를 준수해야 합니다.",
    "2. 이용자는 타인의 권리를 침해하거나 불법적인 행위를 해서는 안 됩니다.",
  ],

  [
    "제5조 (서비스 이용)",
    "1. 앱은 이용자에게 장보기 리스트 작성 및 관리 서비스와 함께 쿠팡파트너스 활동을 활용한 상품 추천 및 링크 제공 서비스를 제공합니다.",
    "2. 쿠팡파트너스 활동을 통해 이용자가 링크를 클릭하여 구매를 진행할 경우, 앱은 제휴 수익을 얻을 수 있습니다.",
    "3. 앱의 서비스는 안정적이고 지속적으로 제공되도록 노력하나, 시스템 유지보수 및 기타 사유로 인해 일시적으로 중단될 수 있습니다.",
  ],

  [
    "제6조 (개인정보 보호)",
    "1. 앱은 이용자의 개인정보를 보호하기 위해 최선을 다하며, 개인정보 처리방침에 따라 수집 및 이용합니다.",
    "2. 이용자는 개인정보 제공에 대해 동의하며, 제공된 정보에 대한 정확성을 보장해야 합니다.",
  ],

  [
    "제7조 (책임 제한)",
    "1. 앱은 서비스 이용 중 발생하는 직접적, 간접적 손해에 대해 책임을 지지 않습니다.",
    "2. 쿠팡파트너스 활동을 통한 구매에 대한 책임은 이용자가 부담하며, 앱은 구매 과정에 개입하지 않습니다.",
    "3. 이용자는 서비스 이용 시 본인의 책임 하에 모든 행위를 해야 합니다.",
  ],

  [
    "제8조 (준거법 및 분쟁 해결)",
    "1. 본 약관의 해석 및 적용에 관하여는 대한민국 법률을 따릅니다.",
    "2. 본 약관과 관련하여 발생하는 분쟁은 [관할 법원]의 소속으로 합니다.",
  ],

  [
    "제9조 (기타)",
    "본 약관에 명시되지 않은 사항은 관련 법령 및 일반 상관습에 따릅니다.",
  ],
];

export default function TermsOfUseView() {
  return (
    <Paper style={styles.container}>
      <ScrollView>
        <View style={{ gap: 16, padding: 16 }}>
          {TERMS_OF_USE.map((term) => {
            return (
              <View style={{ gap: 2 }} key={term[0]}>
                {term.map((value, index) => (
                  <ThemedText
                    key={index}
                    weight={index == 0 ? "bold" : "normal"}
                    size="small"
                  >
                    {value}
                  </ThemedText>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Paper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
