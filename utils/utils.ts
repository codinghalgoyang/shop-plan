import { Plan } from "./types";

export function param2string(param: string | string[]): string {
  return Array.isArray(param) ? param[0] : param;
}

export function findDefaultItemGroupId(plan: Plan) {
  const defaultItemGroup = plan?.itemGroups.find(
    (itemGroup) => itemGroup.category == ""
  );
  if (defaultItemGroup) {
    return defaultItemGroup.id;
  } else {
    throw new Error("Can't find defaultItemGroup");
  }
}

export function findItemGroup(plan: Plan, itemGroupId: string) {
  return plan.itemGroups.find((itemGroup) => itemGroup.id == itemGroupId);
}

export function findItem(plan: Plan, itemGroupId: string, itemId: string) {
  const itemGroup = findItemGroup(plan, itemGroupId);
  return itemGroup?.items.find((item) => item.id == itemId);
}
