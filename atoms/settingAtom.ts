import { Setting } from "@/utils/types";
import { atom } from "recoil";

export const settingState = atom<Setting>({
  key: "setting",
  default: { aodEnabled: false },
});
