import { atom } from "recoil";

export type Setting = {
  aodEnabled: boolean;
};

export const settingState = atom<Setting>({
  key: "setting",
  default: { aodEnabled: false },
});
