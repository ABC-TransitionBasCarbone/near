import QRCode from "qrcode";
import React, { useEffect, useRef } from "react";

interface QRCodeModalProps {
  onClose: () => void;
  link: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ onClose, link }) => {
  const canvasRef = useRef(null);

  const generateQRCode = async (link: string) => {
    if (canvasRef.current) {
      await QRCode.toCanvas(canvasRef.current, link);
    }
  };

  useEffect(() => {
    void generateQRCode(link);
    document.body.classList.add("overflow-hidden");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseOnOverlay = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      onClick={handleCloseOnOverlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative mx-auto bg-white p-5">
        <button
          className="text-gray-500 absolute right-2 top-2"
          onClick={onClose}
        >
          ✖
        </button>
        <p className="mt-2">Scanner le QR code pour remplir le questionnaire</p>
        <canvas ref={canvasRef} className="m-auto" />
      </div>
    </div>
  );
};

export default QRCodeModal;
