export type User = {
  uid: string;
  email: string;
  photo?: string;
  username: string;
};

export type PlanItem = {
  checked: boolean;
  title: string;
  category?: string;
  link?: string;
};

export type PlanItemIndexPair = {
  planItem: PlanItem;
  index: number;
};

export type InvitedPlanUser = {
  uid: string;
  username: string;
};

export type PlanUser = {
  isAdmin: boolean;
} & InvitedPlanUser;

export type Plan = {
  id: string;
  title: string;
  items: PlanItem[];
  planUserUids: string[];
  planUsers: PlanUser[];
  invitedPlanUserUids: string[];
  invitedPlanUsers: InvitedPlanUser[];
};

export type Setting = {
  aodEnabled: boolean;
};
