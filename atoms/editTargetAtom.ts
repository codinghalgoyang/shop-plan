import { Target } from "@/app/plan";
import { atom } from "recoil";

export const editTargetState = atom<Target>({
  key: "edit-target",
  default: null,
});
