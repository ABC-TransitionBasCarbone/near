import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export type SavedBadgeHandle = {
  show: () => void;
};

type SavedBadgeProps = {
  duration?: number;
  label?: string;
  className?: string;
};

const SavedBadge = forwardRef<SavedBadgeHandle, SavedBadgeProps>(
  ({ duration = 3000, label = "Enregistré", className = "" }, ref) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setVisible(false), duration);
      },
    }));

    return (
      <span
        role="status"
        aria-live="polite"
        className={`flex items-center gap-1 text-sm font-bold text-success transition-opacity duration-300 motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        } ${className}`}
      >
        <CheckCircleOutlineIcon aria-hidden fontSize="small" />
        {visible ? label : ""}
      </span>
    );
  },
);

SavedBadge.displayName = "SavedBadge";

export default SavedBadge;
