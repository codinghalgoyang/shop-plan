import { Plan } from "@/utils/types";
import { atom } from "recoil";

export const invitedPlansState = atom<Plan[]>({
  key: "invited-plans",
  default: [],
});
