import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ExtraInputActivateButton from "./ExtraInputActivateButton";
import ExtraInput from "./ExtraInput";
import { firestoreUpdatePlanItem } from "@/utils/api";
import { Plan } from "@/utils/types";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedTextInput from "../Common/ThemedTextInput";
import { Colors } from "@/utils/Colors";
import { modalState } from "@/atoms/modalAtom";
import { useSetRecoilState } from "recoil";

interface PlanItemEditProps {
  plan: Plan;
  itemIdx: number;
  setEditItemIdx: React.Dispatch<React.SetStateAction<number>>;
}

export default function PlanItemEdit({
  plan,
  itemIdx,
  setEditItemIdx,
}: PlanItemEditProps) {
  const setModal = useSetRecoilState(modalState);
  const planItem = plan?.items[itemIdx];
  const [title, setTitle] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [link, setLink] = useState<string | undefined>();
  const [extraEnabled, setExtraEnabled] = useState(false);
  const [isPlanItemChanged, setIsPlanItemChanged] = useState(false);

  const handleSubmit = async () => {
    if (!title) {
      setModal({ visible: true, message: "아이템 항목 이름을 입력해주세요" });
      return;
    }
    try {
      await firestoreUpdatePlanItem(plan, itemIdx, {
        ...planItem,
        title,
        category,
        link,
      });
      setEditItemIdx(-1);
    } catch (error) {
      setModal({
        visible: true,
        title: "서버 통신 에러",
        message: `서버와 연결상태가 좋지 않습니다. (${error})`,
      });
    }
  };

  const handleCancel = () => {
    setEditItemIdx(-1);
  };

  useEffect(() => {
    if (planItem.category || planItem.link) {
      setExtraEnabled(true);
    }
    setTitle(planItem.title);
    setCategory(planItem.category);
    setLink(planItem.link);
    setIsPlanItemChanged(false);
  }, [itemIdx]);

  useEffect(() => {
    setIsPlanItemChanged(
      planItem.title !== title ||
        planItem.category !== category ||
        planItem.link !== link
    );
  }, [itemIdx, title, category, link]);

  return (
    <View style={styles.container}>
      {extraEnabled && (
        <ExtraInput
          type="category"
          text={category || ""}
          setText={setCategory}
        />
      )}
      {extraEnabled && (
        <ExtraInput type="link" text={link || ""} setText={setLink} />
      )}
      <View style={styles.mainInputContainer}>
        <ExtraInputActivateButton
          enabled={extraEnabled}
          setEnabled={setExtraEnabled}
        />
        <ThemedTextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="새로운 항목 입력"
        />
        <ThemedTextButton
          onPress={handleSubmit}
          type="fill"
          color={isPlanItemChanged && title !== "" ? "orange" : "gray"}
          disabled={!isPlanItemChanged || title == ""}
          buttonStyle={{ marginRight: 8 }}
        >
          변경
        </ThemedTextButton>
        <ThemedTextButton onPress={handleCancel} type="fill" color="gray">
          취소
        </ThemedTextButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.background.white,
    paddingRight: 8,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
  },
  mainInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
});
