import { type Dispatch, type SetStateAction } from "react";
import Button from "~/app/_components/_ui/Button";
import LinkAsButton from "~/app/_components/_ui/LinkAsButton";
import Modal from "~/app/_components/_ui/Modal";
import { ButtonStyle } from "~/types/enums/button";
import useUpdateSurveyStep from "../../../hooks/useUpdateSurveyStep";
import { type SurveyPhase } from "@prisma/client";
import { env } from "~/env";

interface RepresentativenessConfirmModal {
  nextStep: SurveyPhase;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}
const RepresentativenessConfirmModal: React.FC<
  RepresentativenessConfirmModal
> = ({ nextStep, showModal, setShowModal }) => {
  const updateSurveyStep = useUpdateSurveyStep();

  return (
    <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      styles="rounded-2xl"
    >
      <div className="flex max-h-screen w-full max-w-[500px] flex-col gap-8 overflow-auto p-8">
        <div className="flex justify-between text-blue">
          <button
            className="font-bold hover:underline"
            onClick={() => setShowModal(false)}
          >
            {"< Retour"}
          </button>
          <button>
            <img
              src="/icons/close.svg"
              alt="Fermer"
              onClick={() => setShowModal(false)}
            />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-auto w-12">
            <img src="/icons/warning-black.svg" alt="" />
          </div>
          <p className="text-lg font-bold">Forcer la fin de l&apos;enquête ?</p>
          <p>
            Vous êtes sur le point de finaliser une enquête qui n’a pas atteint
            ses objectifs de représentativité statistique. Il est probable que
            votre enquête ne donne pas de résultats fidèles à la diversité de la
            population.
          </p>
          <p>
            N’hésitez pas à contacter l’équipe support NEAR pour avoir des
            conseils d’expert avant de prendre cette décision.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <LinkAsButton
            icon="/icons/arrow-right.svg"
            color="blue"
            style={ButtonStyle.FILLED}
            href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}
            customStyle="rounded-[4px]"
          >
            Contacter l&apos;équipe NEAR
          </LinkAsButton>
          <Button
            icon="/icons/arrow-back.svg"
            color="blue"
            onClick={() => setShowModal(false)}
            customStyle="rounded-[4px]"
          >
            Revenir à l&apos;étape précédente
          </Button>
          <Button
            icon="/icons/arrow-right-blue.svg"
            color="blue"
            border={false}
            onClick={() => updateSurveyStep(nextStep)}
            customStyle="rounded-[4px]"
          >
            Finaliser quand même l&apos;enquête
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RepresentativenessConfirmModal;
