"use client";
import { useState } from "react";
import {
  type BroadcastType,
  surveyTypeMapper,
} from "../../../../types/enums/broadcasting";
import Button from "../../_ui/Button";
import QRCodeModal from "./QRCodeModal";
import { useSession } from "next-auth/react";
import { type SurveyType } from "~/types/enums/survey";

interface BroadcastingButtonProps {
  surveyType: SurveyType;
  broadcastType: BroadcastType;
}

const BroadcastingButton: React.FC<BroadcastingButtonProps> = ({
  broadcastType,
  surveyType,
}) => {
  const { data: session } = useSession();

  const [copiedMessage, setCopiedMessage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const broadcastWordings = {
    mail_campaign: {
      title: "Enquête par email ou message",
      description:
        "Générer un lien unique à intégrer dans vos emails ou vos messages",
      button: "Générer un lien email",
      icon: "/icons/mail.svg",
    },
    social_network: {
      title: "Enquête par les réseaux sociaux",
      description:
        "Générer un lien unique à intégrer dans vos posts & stories (Facebook, Instagra...)",
      button: "Générer un lien réseaux sociaux",
      icon: "/icons/facebook.svg",
    },
    street_survey: {
      title: "Enquête sur le terrain",
      description: "Générer un lien unique pour chaque session dans la rue",
      button: "Générer un lien enquêteur",
      icon: "/icons/user.svg",
    },
    qr_code: {
      title: "Enquête via QR code",
      description:
        "Générer un lien unique à intégrer dans vos affiches, flyers",
      button: "Générer un QR code",
      icon: "/icons/qr.svg",
    },
  };

  const buildLink = (type: BroadcastType): string => {
    if (!session?.user.surveyName) {
      return "error";
    }
    return `${surveyTypeMapper[surveyType].baseUrl}#broadcast_channel=${
      type
    }&broadcast_id=${crypto.randomUUID()}&date=${encodeURIComponent(new Date().toISOString())}&neighborhood=${encodeURI(session.user.surveyName)}`;
  };

  const onGenerateClick = async (type: BroadcastType) => {
    const link = buildLink(type);
    await navigator.clipboard.writeText(link);
    setCopiedMessage(
      link === "error" ? "Veuillez réessayer plus tard" : "Lien copié !",
    );
    setShowQRCode(true);
    setTimeout(() => setCopiedMessage(""), 4000);
  };

  return (
    <div className="wrap-wrap flex flex-col justify-between space-y-4 sm:flex-row sm:space-y-0">
      <div>
        <p className="font-bold">{broadcastWordings[broadcastType].title}</p>
        <p>{broadcastWordings[broadcastType].description}</p>
      </div>
      <div className="group relative">
        <Button
          rounded
          onClick={() => onGenerateClick(broadcastType)}
          icon={broadcastWordings[broadcastType].icon}
        >
          {broadcastWordings[broadcastType].button}
        </Button>
        {copiedMessage && (
          <div className="absolute left-1/2 -translate-x-1/2 px-3 py-1 text-center text-sm text-black opacity-0 transition-opacity group-hover:opacity-100">
            {copiedMessage}
          </div>
        )}
        {broadcastType === "qr_code" && showQRCode && (
          <QRCodeModal
            onClose={() => {
              setShowQRCode(false);
              document.body.classList.remove("overflow-hidden");
            }}
            link={buildLink(broadcastType)}
          ></QRCodeModal>
        )}
      </div>
    </div>
  );
};

export default BroadcastingButton;
