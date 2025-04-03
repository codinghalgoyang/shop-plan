// API types
export type User = {
  uid: string;
  email: string;
  photo?: string;
  username: string;
  isAgreed: boolean;
  createdAt: number;
};

export type Item = {
  id: string;
  checked: boolean;
  title: string;
  link: string;
  createdAt: number;
};

export type ItemGroup = {
  id: string;
  category: string;
  items: Item[];
};

export type InvitedPlanUser = {
  uid: string;
  username: string;
  createdAt: number;
};

export type PlanUser = {
  isAdmin: boolean;
} & InvitedPlanUser;

export type Plan = {
  id: string;
  title: string;
  itemGroups: ItemGroup[];
  planUserUids: string[];
  planUsers: PlanUser[];
  invitedPlanUserUids: string[];
  invitedPlanUsers: InvitedPlanUser[];
  createdAt: number;
};

// etc types
export type Setting = {
  aodEnabled: boolean;
};

export type PlanViewMode =
  | "ADD_ITEM"
  | "EDIT_ITEM"
  | "DELETE"
  | "ADD_CATEGORY"
  | "EDIT_CATEGORY";

export interface EditingItemInfo {
  category: string;
  item: Item | null;
}

export interface EditingCategoryInfo {
  category: string;
  itemGroupId: string;
}

export interface PlanViewStatus {
  planViewMode: PlanViewMode;
  activatedItemGroupId: string;
  editingItemInfo: EditingItemInfo;
  editingCategoryInfo: EditingCategoryInfo;
}
