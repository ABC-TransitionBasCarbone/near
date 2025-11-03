import Button from "~/app/_components/_ui/Button";
import Modal from "~/app/_components/_ui/Modal";

interface PasswordModalProps {
  showModal: boolean;
  onPasswordModalClose: () => void;
  password: string;
}
const PasswordModal: React.FC<PasswordModalProps> = ({
  showModal,
  onPasswordModalClose,
  password,
}) => {
  return (
    <Modal
      show={showModal}
      onClose={() => onPasswordModalClose()}
      styles="rounded-2xl"
    >
      <div className="flex max-h-screen w-full max-w-[500px] flex-col gap-8 overflow-auto p-8">
        <div className="flex flex-col gap-3">
          <div>L&apos;utilisateur a bien été créé !</div>
          <div className="flex flex-row gap-4">
            <img className="w-7" src="/icons/warning-black.svg" alt="" />
            <p className="font-bold">
              Voici le mot de passe à communiquer à la personne. Attention il ne
              sera plus jamais visible !
            </p>
          </div>

          <div className="flex flex-row items-center justify-between bg-grayExtraLight p-4">
            <p className="">{password}</p>
            <button
              onClick={() => navigator.clipboard.writeText(password)}
              className="bg-blue-500 hover:bg-blue-600 rounded px-3 py-1 transition"
            >
              Copier
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            icon="/icons/arrow-back.svg"
            color="blue"
            onClick={() => onPasswordModalClose()}
            customStyle="rounded-[4px]"
          >
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordModal;
