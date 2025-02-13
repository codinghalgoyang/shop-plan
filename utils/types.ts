export type ShopPlanUser = {
  uid: string;
  email: string;
  photo?: string;
  username: string;
  agreed: boolean;
  plans: {
    planId: string;
    notificationEnabled: boolean;
    customTitle: string;
  }[];
  invitedPlanIds: string[];
  defaultNotificationEnabled: {
    all: boolean;
    modifyItem: boolean;
    checkedItem: boolean;
    modifyUser: boolean;
    planInvite: boolean;
  };
  notifications: string[];
  aodEnabled: boolean;
};
