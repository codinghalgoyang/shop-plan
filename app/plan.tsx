import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { useLocalSearchParams } from "expo-router";
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import PlanItemView from "@/components/Plan/PlanItemView";
import { param2string } from "@/utils/utils";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { plansState } from "@/atoms/plansAtom";
import { settingState } from "@/atoms/settingAtom";
import { useKeepAwake } from "expo-keep-awake";
import { Colors } from "@/utils/Colors";
import PlanItemInput from "@/components/Plan/PlanItemInput";
import { Plan } from "@/utils/types";
import ThemedText from "@/components/Common/ThemedText";
import Paper from "@/components/Common/Paper";
import { useState } from "react";
import PlanItemEdit from "@/components/Plan/PlanItemEdit";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import {
  firestoreRemoveAllPlanItem,
  firestoreRemoveCheckedPlanItem,
} from "@/utils/api";
import ThemedIcon from "@/components/Common/ThemedIcon";
import AntDesign from "@expo/vector-icons/AntDesign";
import { modalState } from "@/atoms/modalAtom";

function getCategories(plan: Plan) {
  const allCategories = plan?.items.map((item) => item.category);
  const uniqueCategories = [...new Set(allCategories)].sort();
  if (uniqueCategories.includes("")) {
    const categories = uniqueCategories.filter((category) => category !== ""); // remove ""
    categories.push(""); // add "" at the end
    return categories;
  } else {
    return uniqueCategories;
  }
}

async function openCoupangHome() {
  const setModal = useSetRecoilState(modalState);
  const coupangHomeLink = "https://link.coupang.com/a/cizNQT";
  const supported = await Linking.canOpenURL(coupangHomeLink);

  if (supported) {
    await Linking.openURL(coupangHomeLink);
  } else {
    setModal({
      visible: true,
      message: `'${coupangHomeLink}'를 열 수 없습니다.`,
    });
  }
}

export default function PlanScreen() {
  const setModal = useSetRecoilState(modalState);
  const { index: paramIndex } = useLocalSearchParams();
  const index = parseInt(param2string(paramIndex));
  const plans = useRecoilValue(plansState);
  const plan = plans[index];
  const setting = useRecoilValue(settingState);
  const categories = getCategories(plan);
  const [editItemIdx, setEditItemIdx] = useState(-1);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // TODO : 이걸 useEffect로 빼면 에러가나네. 왜그럴까?
  if (setting.aodEnabled) {
    useKeepAwake();
  }

  return (
    <ScreenView>
      <Header title={plan ? plan.title : "Loading..."} enableBackAction>
        <View style={{ flexDirection: "row", marginRight: 4 }}>
          <ThemedTextButton
            buttonStyle={styles.deleteButton}
            size="small"
            color={isDeleteMode ? "orange" : "gray"}
            onPress={() => {
              setIsDeleteMode((prev) => !prev);
            }}
          >
            개별삭제
          </ThemedTextButton>
          <ThemedTextButton
            buttonStyle={styles.deleteButton}
            size="small"
            color="orange"
            onPress={() => {
              setModal({
                visible: true,
                title: "삭제 확인",
                message: "완료된 항목을 삭제하시겠습니까?",
                onConfirm: () => {
                  if (!firestoreRemoveCheckedPlanItem(plan)) {
                    setModal({
                      visible: true,
                      message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
                    });
                  }
                },
                onCancel: () => {},
              });
            }}
          >
            완료삭제
          </ThemedTextButton>
          <ThemedTextButton
            buttonStyle={styles.deleteButton}
            size="small"
            color="orange"
            onPress={() => {
              setModal({
                visible: true,
                title: "삭제 확인",
                message: "전체 항목을 삭제하시겠습니까?",
                onConfirm: () => {
                  if (!firestoreRemoveAllPlanItem(plan)) {
                    setModal({
                      visible: true,
                      message: `서버와 연결상태가 좋지 않습니다. 인터넷 연결을 확인해주세요.`,
                    });
                  }
                },
                onCancel: () => {},
              });
            }}
          >
            전체삭제
          </ThemedTextButton>
        </View>
      </Header>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ gap: 8 }}>
          {categories.map((category) => {
            return (
              <View key={category} style={{ gap: 8 }}>
                <ThemedText
                  size="small"
                  color="gray"
                  style={{ marginLeft: 12 }}
                >
                  {categories.length == 1 && categories[0] == ""
                    ? "구매 항목"
                    : category == ""
                    ? "분류 없음"
                    : category}
                </ThemedText>
                <Paper>
                  {plan?.items.map((planItem, itemIdx) => {
                    if (planItem.checked) return null;
                    if (planItem.category !== category) return null;
                    return (
                      <PlanItemView
                        key={planItem.title + itemIdx}
                        plan={plan}
                        itemIdx={itemIdx}
                        isFirstItem={itemIdx == 0}
                        editItemIdx={editItemIdx}
                        setEditItemIdx={setEditItemIdx}
                        isDeleteMode={isDeleteMode}
                      />
                    );
                  })}
                  {plan?.items.map((planItem, itemIdx) => {
                    if (!planItem.checked) return null;
                    if (planItem.category !== category) return null;
                    return (
                      <PlanItemView
                        key={planItem.title}
                        plan={plan}
                        itemIdx={itemIdx}
                        editItemIdx={editItemIdx}
                        setEditItemIdx={setEditItemIdx}
                        isDeleteMode={isDeleteMode}
                      />
                    );
                  })}
                </Paper>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View
        style={{
          backgroundColor: Colors.background.lightGray,
          padding: 8,
        }}
      >
        <TouchableOpacity
          onPress={openCoupangHome}
          style={{
            flexDirection: "row",
            backgroundColor: Colors.blue,
            width: "100%",
            paddingVertical: 12,
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            borderRadius: 5,
          }}
        >
          <ThemedIcon
            IconComponent={AntDesign}
            iconName="search1"
            color="white"
          />
          <ThemedText style={{ color: Colors.content.white, marginTop: -2 }}>
            쿠팡에서 상품 찾아보기
          </ThemedText>
        </TouchableOpacity>
      </View>
      {editItemIdx !== -1 ? (
        <PlanItemEdit
          plan={plan}
          itemIdx={editItemIdx}
          setEditItemIdx={setEditItemIdx}
        />
      ) : (
        <PlanItemInput plan={plan} />
      )}
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingVertical: 8,
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
});
