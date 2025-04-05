// API types
export interface User {
  uid: string;
  email: string;
  photo?: string;
  username: string;
  isAgreed: boolean;
  createdAt: number;
}

export interface Item {
  id: string;
  checked: boolean;
  title: string;
  link: string;
  createdAt: number;
}

function isItemType(obj: any): obj is Item {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.checked === "boolean" &&
    typeof obj.title === "string" &&
    typeof obj.link === "string" &&
    typeof obj.createdAt === "number"
  );
}

export interface ItemGroup {
  id: string;
  category: string;
  items: Item[];
}

function isItemGroupType(obj: any): obj is ItemGroup {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "string" &&
    typeof obj.category === "string" &&
    Array.isArray(obj.items)
    // && obj.items.every((item: any) => isItemType(item)) // items 배열의 모든 요소가 Item인지 확인
  );
}

export interface InvitedPlanUser {
  uid: string;
  username: string;
  createdAt: number;
}

export interface PlanUser extends InvitedPlanUser {
  isAdmin: boolean;
}

export type Plan = {
  id: string;
  title: string;
  itemGroups: ItemGroup[]; // default로 분류 없음, category는 마지막 Group으로 유지함
  planUserUids: string[];
  planUsers: PlanUser[];
  invitedPlanUserUids: string[];
  invitedPlanUsers: InvitedPlanUser[];
  createdAt: number;
};
