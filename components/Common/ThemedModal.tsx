import React from "react";
import { View, StyleSheet } from "react-native";
import ThemedText from "./ThemedText";
import ThemedTextButton from "./ThemedTextButton";
import { defaultModal, modalState } from "@/atoms/modalAtom";
import { useRecoilState } from "recoil";
import Paper from "./Paper";

export default function ThemedOverlay() {
  const [modal, setModal] = useRecoilState(modalState);

  if (!modal.visible) return null; // 모달이 보이지 않을 때는 아무것도 렌더링하지 않음

  return (
    <View style={styles.overlay}>
      <Paper style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          {modal.title && <ThemedText weight="bold">{modal.title}</ThemedText>}
          <ThemedText>{modal.message}</ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          {modal.onCancel && (
            <ThemedTextButton
              onPress={() => {
                modal.onCancel?.();
                setModal(defaultModal);
              }}
              color="gray"
            >
              취소
            </ThemedTextButton>
          )}
          <ThemedTextButton
            onPress={() => {
              modal.onConfirm?.();
              setModal(defaultModal);
            }}
            color="blue"
          >
            확인
          </ThemedTextButton>
        </View>
      </Paper>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000, // 다른 컴포넌트 위에 표시되도록 zIndex 설정
  },
  modalContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "flex-end",
    maxWidth: "80%",
  },
  contentContainer: { gap: 8 },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginRight: -8,
  },
});
