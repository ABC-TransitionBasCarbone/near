import React, { useEffect, useState } from "react";
import { NotificationType } from "~/types/enums/notifications";
import { type Notification } from "~/types/Notification";

const NotificationToast: React.FC<Notification> = ({ type, value, id }) => {
  const textColors = {
    [NotificationType.ERROR]: "bg-error text-white",
    [NotificationType.SUCCESS]: "bg-success text-white",
    [NotificationType.INFO]: "bg-info text-white",
  };
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (value) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 5000);
    } else {
      setShow(false);
    }
  }, [value, id]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`absolute left-0 top-0 z-50 flex h-[48px] w-full items-center justify-center gap-6 font-bold ${textColors[type]}`}
    >
      <div>{value}</div>
      <button
        type="button"
        className="p-1 text-white"
        onClick={() => setShow(false)}
      >
        <i>Fermer</i> X
      </button>
    </div>
  );
};

export default NotificationToast;
