import { PlanViewStatus } from "@/utils/types";
import { atom } from "recoil";

export const defaultPlanViewStatus: PlanViewStatus = {
  planViewMode: "ADD_ITEM",
  activatedItemGroupId: "",
  editingItemInfo: { category: "", item: null },
  editingCategoryInfo: { category: "", itemGroupId: "" },
};

export const planViewStatusState = atom<PlanViewStatus>({
  key: "planViewStatus",
  default: defaultPlanViewStatus,
});
