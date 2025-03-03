"use client";

import crypto from "crypto";
import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

import NotificationToast from "../notifications/NotificationToast";
import {
  type Notification,
  type NotificationContextType,
} from "~/types/Notification";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const setNotificationMemoized = useCallback((data: Notification | null) => {
    if (data) {
      const notificationId = crypto.randomBytes(16).toString("hex");
      setNotification({ ...data, id: notificationId });
    }
  }, []);

  const value = useMemo(
    () => ({ notification, setNotification: setNotificationMemoized }),
    [notification, setNotificationMemoized],
  );

  return (
    <NotificationContext.Provider value={value}>
      {notification && <NotificationToast {...notification} />}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
