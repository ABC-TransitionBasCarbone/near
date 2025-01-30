"use client";
import { useState } from "react";
import Button from "./_ui/Button";
import { env } from "../../env";
import { type SurveyType, type BroadcastType } from "./BroadcastingPage";

interface BroadcastingButtonProps {
  surveyType: SurveyType;
  broadcastType: BroadcastType;
}

const BroadcastingButton: React.FC<BroadcastingButtonProps> = (
  props: BroadcastingButtonProps,
) => {
  const broadcastWordings = {
    mail_campaign: {
      title: "Enquête par email ou message",
      description:
        "Générer un lien unique à intégrer dans vos emails ou vos messages",
      button: "Générer un lien email",
    },
    social_network: {
      title: "Enquête par les réseaux sociaux",
      description:
        "Générer un lien unique à intégrer dans vos posts & stories (Facebook, Instagra...)",
      button: "Générer un lien réseaux sociaux",
    },
    street_survey: {
      title: "Enquête sur le terrain",
      description: "Générer un lien unique pour chaque session dans la rue",
      button: "Générer un lien enquêteur",
    },
    qr_code: {
      title: "Enquête via QR code",
      description:
        "Générer un lien unique à intégrer dans vos affiches, flyers",
      button: "Générer un QR code",
    },
  };

  const generateTypeformUniqueLink = async (type: BroadcastType) => {
    const link = `${env.NEXT_PUBLIC_TYPEFORM_SU_LINK}#broadcast_channel=${
      type
    }&broadcast_id=${crypto.randomUUID()}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [copied, setCopied] = useState(false);

  return (
    <div className="wrap-wrap flex justify-between">
      <div>
        <p className="font-bold">
          {broadcastWordings[props.broadcastType].title}
        </p>
        <p>{broadcastWordings[props.broadcastType].description}</p>
      </div>
      <div className="group relative">
        <Button
          onClick={() => generateTypeformUniqueLink(props.broadcastType)}
          icon="/icons/user.svg"
        >
          {broadcastWordings[props.broadcastType].button}
        </Button>
        {copied && (
          <div className="absolute left-1/2 top-10 -translate-x-1/2 px-3 py-1 text-center text-sm text-black opacity-0 transition-opacity group-hover:opacity-100">
            Lien Copié !
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastingButton;
