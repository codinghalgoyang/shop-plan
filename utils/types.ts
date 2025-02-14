export type UserPlanCustomInfo = {
  notificationEnabled: boolean;
  customTitle: string;
};

export type UserInfo = {
  uid: string;
  email: string;
  photo?: string;
  username: string;
  agreed: boolean;
  userPlanIds: string[];
  userInvitedPlanIds: string[];
  userPlanCustomInfos: Object;
  notifications: string[];
  defaultNotificationEnabled: {
    all: boolean;
    modifyItem: boolean;
    checkedItem: boolean;
    modifyUser: boolean;
    planInvite: boolean;
  };
  aodEnabled: boolean;
};

export type PlanItem = {
  checked: boolean;
  title: string;
  category?: string;
  link?: string;
};

export type PlanUser = {
  uid: string;
  username: string;
};

export type Plan = {
  id: string;
  title: string;
  admins: string[];
  planUsers: PlanUser[];
  planInvitedUsers: PlanUser[];
  items: PlanItem[];
};
