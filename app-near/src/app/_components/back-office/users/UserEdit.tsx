"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import {
  userform,
  type UserForm,
} from "~/shared/validations/userEdit.validation";
import { api } from "~/trpc/react";
import { NotificationType } from "~/types/enums/notifications";
import { useNotification } from "../../_context/NotificationProvider";
import { getErrorValue } from "../../_services/error";
import Button from "../../_ui/Button";
import FormInput from "../../_ui/form/FormInput";
import FormSelect from "../../_ui/form/FormSelect";
import PasswordModal from "./PasswordModal";

const UserEdit: React.FC = () => {
  const utils = api.useUtils();
  const surveyList = api.surveys.querySurveys.useQuery({ limit: 100 });
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const methods = useForm<UserForm>({
    resolver: zodResolver(userform),
    mode: "all",
  });

  const { handleSubmit } = methods;

  const router = useRouter();
  const { setNotification } = useNotification();

  const createUserMutation = api.users.createPilote.useMutation({
    onSuccess: async (data) => {
      await utils.users.queryPiloteUsers.invalidate();
      setUserPassword(data?.password ?? null);
      setShowModal(true);
    },
    onError: async (error) => {
      setNotification({
        type: NotificationType.ERROR,
        value: getErrorValue(error),
      });
    },
  });

  const onPasswordModalClose = () => {
    setShowModal(false);
    router.push("/back-office/utilisateurs");
  };

  const onSubmit: SubmitHandler<UserForm> = async (values) => {
    await createUserMutation.mutateAsync(values);
  };

  return (
    <>
      {userPassword && (
        <PasswordModal
          showModal={showModal}
          onPasswordModalClose={onPasswordModalClose}
          password={userPassword}
        />
      )}

      <div className="m-auto flex max-w-lg justify-center">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-3"
          >
            <h1>Nouvel utilisateur</h1>
            <FormInput
              id="email"
              name="email"
              label="Email de l'utilisateur"
              type="email"
              placeholder="Saisissez l'email de l'utilisateur"
              required
            />
            <FormSelect
              name="surveyId"
              label="Quartier de l'utilisateur"
              required
              options={
                surveyList.data?.items.map((survey) => ({
                  id: survey.id,
                  value: survey.name,
                })) ?? []
              }
            />

            <div className="flex justify-center gap-6">
              <Button
                className="mt-6"
                color="gray"
                onClick={() => router.push("/back-office/utilisateurs")}
              >
                Annuler
              </Button>
              <Button type="submit" className="mt-6">
                Ajouter
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default UserEdit;
