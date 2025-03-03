import React, { type ReactNode, useEffect } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  styles?: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children, styles }) => {
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

  useEffect(() => {
    document.addEventListener("keyup", handleKeyPress);
    return () => {
      document.removeEventListener("keyup", handleKeyPress);
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
      <div
        className={`relative top-1/2 mx-auto max-h-[95vh] w-fit -translate-y-1/2 transform cursor-auto rounded-lg bg-white ${styles}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
