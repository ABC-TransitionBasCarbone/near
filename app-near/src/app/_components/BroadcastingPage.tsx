import Button from "./_ui/Button";

interface BroadcastingPageProps {
  surveyType: "su" | "ngc" | "mdv" | "mdd";
}

const BroadcastingPage: React.FC<BroadcastingPageProps> = (
  props: BroadcastingPageProps,
) => {
  return (
    <>
      <div className="space-y-10">
        <div className="wrap-wrap flex justify-between">
          <div>
            <p className="font-bold">Enquête sur le terrain</p>
            <p>Générer un lien unique pour chaque session dans la rue</p>
          </div>
          <Button icon="/icons/user.svg">Générer un lien enquêteur</Button>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-bold">Enquête par email ou message</p>
            <p>
              Générer un lien unique à intégrer dans vos emails ou vos messages
            </p>
          </div>
          <Button icon="/icons/mail.svg">Générer un lien email</Button>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-bold">Enquête par les réseaux sociaux</p>
            <p>
              Générer un lien unique à intégrer dans vos posts & stories
              (Facebook, Instagra...)
            </p>
          </div>
          <Button icon="/icons/facebook.svg">
            Générer un lien réseaux sociaux
          </Button>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-bold">Enquête via QR code</p>
            <p>Générer un lien unique à intégrer dans vos affiches, flyers</p>
          </div>
          <Button icon="/icons/qr.svg">Générer un QR code</Button>
        </div>
      </div>
    </>
  );
};

export default BroadcastingPage;
