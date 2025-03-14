import { User } from "@/utils/types";
import { atom } from "recoil";

export type Modal = {
  visible: boolean;
  title?: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export const defaultModal: Modal = {
  visible: false,
  title: undefined,
  message: "",
  onConfirm: undefined,
  onCancel: undefined,
};

export const modalState = atom<Modal>({
  key: "modal",
  default: defaultModal,
});
