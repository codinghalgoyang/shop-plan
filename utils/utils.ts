import { Item, Plan } from "./types";

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

export function findItemGroup(plan: Plan | undefined, itemGroupId: string) {
  return plan?.itemGroups.find((itemGroup) => itemGroup.id === itemGroupId);
}

export function findItem(plan: Plan | undefined, itemId: string) {
  for (let i = 0; plan?.itemGroups.length; i++) {
    const itemGroup = plan.itemGroups[i];
    for (let j = 0; j < itemGroup.items.length; j++) {
      const item = itemGroup.items[j];
      if (item.id === itemId) {
        return item;
      }
    }
  }
  return undefined;
}
