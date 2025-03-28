export type User = {
  uid: string;
  email: string;
  photo?: string;
  username: string;
  isAgreed: boolean;
  createdAt: number;
  updatedAt: number;
};

export type PlanItem = {
  checked: boolean;
  title: string;
  category?: string;
  link?: string;
  createdAt: number;
  updatedAt: number;
};

export type InvitedPlanUser = {
  uid: string;
  username: string;
  createdAt: number;
  updatedAt: number;
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
  createdAt: number;
  updatedAt: number;
};

export type Setting = {
  aodEnabled: boolean;
};
