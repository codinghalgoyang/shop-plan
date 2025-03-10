import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import ExtraInputActivateButton from "./ExtraInputActivateButton";
import ExtraInput, { ExtraInputType } from "./ExtraInput";
import { firestoreAddPlanItem } from "@/utils/api";
import { Plan } from "@/utils/types";
import ThemedTextButton from "@/components/Common/ThemedTextButton";
import ThemedTextInput from "../Common/ThemedTextInput";
import { Colors } from "@/utils/Colors";

interface PlanItemEditProps {
  plan: Plan;
  itemIdx: number;
  setIsPlanItemEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlanItemEdit({
  plan,
  itemIdx,
  setIsPlanItemEdit,
}: PlanItemEditProps) {
  const planItem = plan?.items[itemIdx];
  const [title, setTitle] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [link, setLink] = useState<string | undefined>();
  const [extraEnabled, setExtraEnabled] = useState(false);
  const [isPlanItemChanged, setIsPlanItemChanged] = useState(false);

  const handleSubmit = () => {
    if (!title) {
      console.log("Input title first");
      return;
    }
    // firestoreAddPlanItem(plan, title, category, link); => edit

    setIsPlanItemEdit(false);
  };

  const handleCancel = () => {
    setIsPlanItemEdit(false);
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
