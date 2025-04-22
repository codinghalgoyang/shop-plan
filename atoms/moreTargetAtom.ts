import { Target } from "@/app/plan";
import { atom } from "recoil";

export const moreTargetState = atom<Target>({
  key: "more-target",
  default: null,
});
