import React from "react";
import { View, Modal, StyleSheet } from "react-native";
import ThemedText from "./ThemedText";
import ThemedTextButton from "./ThemedTextButton";
import { defaultModal, modalState } from "@/atoms/modalAtom";
import { useRecoilState } from "recoil";
import Paper from "./Paper";

export default function ThemedModal() {
  const [modal, setModal] = useRecoilState(modalState);

  return (
    <Modal
      transparent={true}
      visible={modal.visible}
      onRequestClose={modal.onCancel}
    >
      <View style={styles.container}>
        <Paper style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            {modal.title && (
              <ThemedText weight="bold">{modal.title}</ThemedText>
            )}
            <ThemedText>{modal.message}</ThemedText>
          </View>
          <View style={styles.buttonContainer}>
            <ThemedTextButton
              onPress={() => {
                modal.onConfirm?.();
                setModal(defaultModal);
              }}
              color="blue"
            >
              확인
            </ThemedTextButton>
            {modal.onCancel && (
              <ThemedTextButton
                onPress={() => {
                  modal.onCancel?.();
                  setModal(defaultModal);
                }}
                color="orange"
              >
                취소
              </ThemedTextButton>
            )}
          </View>
        </Paper>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 16,
    alignItems: "center",
  },
  contentContainer: { gap: 8 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
    marginRight: -12,
  },
});
