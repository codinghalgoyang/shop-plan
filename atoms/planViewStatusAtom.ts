import { PlanViewStatus } from "@/utils/types";
import { atom } from "recoil";

export const planViewStatusState = atom<PlanViewStatus>({
  key: "planViewStatus",
  default: {
    planViewMode: "ADD_ITEM",
    activatedCategory: "",
    editItemInfo: { category: "", item: null },
  },
});
