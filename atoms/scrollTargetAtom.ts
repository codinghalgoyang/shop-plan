import { Target } from "@/app/plan";
import { atom } from "recoil";

export const scrollTargetState = atom<Target>({
  key: "scroll-target",
  default: null,
});
