import { Plan } from "@/utils/types";
import { atom } from "recoil";

export const plansState = atom<Plan[]>({
  key: "plans",
  default: [],
});
