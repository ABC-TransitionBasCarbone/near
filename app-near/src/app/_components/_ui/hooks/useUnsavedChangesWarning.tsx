import { useEffect } from "react";
import { useNotification } from "../../_context/NotificationProvider";
import { NotificationType } from "~/types/enums/notifications";

export const useUnsavedChangesWarning = (
  hasUnsavedChanges: boolean,
  storageKey: string,
) => {
  const { setNotification } = useNotification();

  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) {
      sessionStorage.removeItem(storageKey);
      setNotification({
        type: NotificationType.ERROR,
        value: "Vos dernières modifications n'ont pas été enregistrées.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      sessionStorage.setItem(storageKey, "1");
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, storageKey]);
};
