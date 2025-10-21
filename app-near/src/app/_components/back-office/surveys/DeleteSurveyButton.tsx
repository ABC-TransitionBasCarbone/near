import { useState } from "react";
import Modal from "../../_ui/Modal";
import Button from "../../_ui/Button";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { api } from "~/trpc/react";
import { useNotification } from "../../_context/NotificationProvider";
import { NotificationType } from "~/types/enums/notifications";
import { getErrorValue } from "../../_services/error";

interface DeleteSurveyButtonProps {
  id: number;
  name: string;
}
const DeleteSurveyButton: React.FC<DeleteSurveyButtonProps> = ({
  id,
  name,
}) => {
  const utils = api.useUtils();

  const [open, setOpen] = useState(false);
  const { setNotification } = useNotification();

  const deleteSurveyMutation = api.surveys.delete.useMutation({
    onError: (error) =>
      setNotification({
        type: NotificationType.ERROR,
        value: getErrorValue(error),
      }),
    onSuccess: async () => {
      await utils.surveys.getAll.invalidate();
    },
  });

  const deleteHandler = async () => {
    await deleteSurveyMutation.mutateAsync(id);
    setOpen(false);
  };

  return (
    <>
      <Modal onClose={() => setOpen(false)} show={open}>
        <div className="flex max-w-md flex-col gap-5 p-6">
          <p className="text-2xl font-bold text-blue">Attention !</p>
          <p>
            Vous êtes sur le point de supprimer le quartier{" "}
            <strong>{name}</strong>
          </p>
          <p>
            Cette action est irréversible, l&apos;ensemble des données associées
            à ce quartier (sondages, sphères d&apos;usages, etc.) seront
            supprimées.
          </p>

          <Button onClick={deleteHandler}>
            Je confirme la suppression de ce quartier
          </Button>
        </div>
      </Modal>
      <Button
        border={false}
        color="error"
        onClick={() => {
          console.log(`TODO ${id}`);
          setOpen(true);
        }}
      >
        <DeleteForeverOutlinedIcon aria-hidden />
        Supprimer
      </Button>
    </>
  );
};

export default DeleteSurveyButton;
