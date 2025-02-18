import React, { type ReactNode, useEffect } from "react";
import Button from "./Button";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  showButtons?: boolean;
  confirmMessage?: string;
  cancelMessage?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  onConfirm,
  onCancel,
  showButtons = false,
  confirmMessage = "Confirmer",
  cancelMessage = "Annuler",
  children,
}) => {
  const outsideRef = React.useRef(null);

  const handleKeyPress = (event: KeyboardEvent) => {
    event.stopPropagation();
    if (event.code === "Escape") {
      onClose();
    }
  };

  const handleCloseOnOverlay = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (e.target === outsideRef.current) {
      onClose();
    }
  };

  const handleOnCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleOnConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div
      ref={outsideRef}
      onClick={handleCloseOnOverlay}
      className="fixed left-0 top-0 z-40 h-screen w-screen items-center justify-center bg-grayLight/50"
    >
      <div className="relative top-1/2 mx-auto max-h-[95vh] w-fit -translate-y-1/2 transform cursor-auto rounded-lg bg-white">
        {children}
        {showButtons && (
          <div className="flex justify-center gap-3 py-4">
            <Button buttonType="button" onClick={handleOnCancel} color="white">
              {cancelMessage}
            </Button>
            {onConfirm && (
              <Button buttonType="button" onClick={handleOnConfirm}>
                {confirmMessage}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
