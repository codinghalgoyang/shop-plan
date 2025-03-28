import Header from "@/components/Common/Header";
import ScreenView from "@/components/Common/ScreenView";
import { router, useLocalSearchParams } from "expo-router";
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
  firestoreUncheckAllItems,
} from "@/utils/api";
import ThemedIcon from "@/components/Common/ThemedIcon";
import AntDesign from "@expo/vector-icons/AntDesign";
import { modalState } from "@/atoms/modalAtom";
import ThemedIconTextButton from "@/components/Common/ThemedIconTextButton";

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
  const coupangHomeLink = "https://link.coupang.com/a/cizNQT";
  const supported = await Linking.canOpenURL(coupangHomeLink);

  if (supported) {
    await Linking.openURL(coupangHomeLink);
  }
}

export default function PlanScreen() {
  const setModal = useSetRecoilState(modalState);
  const { plan_id: planId } = useLocalSearchParams();
  const plans = useRecoilValue(plansState);
  const plan = plans.find((plan) => plan.id === planId);
  if (plan === undefined) {
    router.back();
    return null;
  }
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
        <ThemedIconTextButton
          IconComponent={AntDesign}
          iconName={"check"}
          title={"모두해제"}
          onPress={async () => {
            try {
              await firestoreUncheckAllItems(plan);
            } catch (error) {
              setModal({
                visible: true,
                title: "서버 통신 에러",
                message: `서버와 연결상태가 좋지 않습니다. (${error})`,
              });
            }
          }}
        />
        <ThemedIconTextButton
          IconComponent={AntDesign}
          iconName={"delete"}
          title={"삭제모드"}
          color={isDeleteMode ? "orange" : "black"}
          onPress={() => {
            if (plan?.items.length !== 0 || isDeleteMode) {
              setIsDeleteMode((prev) => !prev);
            } else {
              setModal({
                visible: true,
                title: "삭제 모드 활성화 실패",
                message: `삭제할 항목이 없습니다.`,
              });
            }
          }}
          style={{ marginRight: 8 }}
        />
      </Header>
      <View style={styles.container}>
        {!isDeleteMode && (
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
              <ThemedText
                style={{ color: Colors.content.white, marginTop: -2 }}
              >
                쿠팡에서 상품 찾아보기
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
                        key={planItem.title + planItem.createdAt}
                        plan={plan}
                        itemIdx={itemIdx}
                        needTopBorder={itemIdx == 0}
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
                        key={planItem.title + planItem.createdAt}
                        plan={plan}
                        itemIdx={itemIdx}
                        needTopBorder={itemIdx == 0}
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

      {isDeleteMode ? (
        <View
          style={{
            backgroundColor: Colors.background.lightGray,
            padding: 12,
            gap: 8,
          }}
        >
          <ThemedTextButton
            type="outline"
            color="orange"
            buttonStyle={{ width: "100%" }}
            onPress={() => {
              if (plan?.items.filter((item) => item.checked).length !== 0) {
                setModal({
                  visible: true,
                  title: "삭제 확인",
                  message: "완료된 항목을 삭제하시겠습니까?",
                  onConfirm: () => {
                    try {
                      firestoreRemoveCheckedPlanItem(plan);
                    } catch (error) {
                      setModal({
                        visible: true,
                        title: "서버 통신 에러",
                        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
                      });
                    }
                  },
                  onCancel: () => {},
                });
              } else {
                setModal({
                  visible: true,
                  message: `삭제할 완료항목이 없습니다.`,
                });
              }
            }}
          >
            완료 항목 삭제
          </ThemedTextButton>
          <ThemedTextButton
            type="fill"
            color="orange"
            buttonStyle={{ width: "100%" }}
            onPress={() => {
              if (plan?.items.length !== 0) {
                setModal({
                  visible: true,
                  title: "삭제 확인",
                  message: "전체 항목을 삭제하시겠습니까?",
                  onConfirm: () => {
                    try {
                      firestoreRemoveAllPlanItem(plan);
                    } catch (error) {
                      setModal({
                        visible: true,
                        title: "서버 통신 에러",
                        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
                      });
                    }
                  },
                  onCancel: () => {},
                });
              } else {
                setModal({
                  visible: true,
                  message: `삭제할 항목이 없습니다.`,
                });
              }
            }}
          >
            전체 항목 삭제
          </ThemedTextButton>
        </View>
      ) : editItemIdx !== -1 ? (
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
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
});
