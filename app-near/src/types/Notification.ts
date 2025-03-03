import { type NotificationType } from "./enums/notifications";

export type Notification = {
  id?: string;
  type: NotificationType;
  value: string;
};

export type NotificationContextType = {
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
};
