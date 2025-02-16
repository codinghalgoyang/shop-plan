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
  invitedPlanUsers: InvitedPlanUser[];
};
