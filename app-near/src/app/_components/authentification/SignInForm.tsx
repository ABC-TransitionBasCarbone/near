"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { type UserLoginForm } from "~/types/User";
import Button from "~/app/_components/_ui/Button";
import { ButtonStyle } from "~/types/enums/button";
import { type LoginError } from "~/types/enums/login";
import { RoleName } from "@prisma/client";
import FormInput from "../_ui/form/FormInput";

const CompanyFormRegistration = z.object({
  email: z
    .string()
    .min(1, { message: "Veuillez renseigner votre email" })
    .email({ message: "format d'email invalide" }),
  password: z
    .string()
    .min(1, { message: "Veuillez renseigner un mot de passe" }),
});

const displayError: Record<LoginError, string> = {
  ["CredentialsSignin"]: "Accès non autorisé",
};

export default function SignInForm(): JSX.Element {
  const router = useRouter();

  const { data: session } = useSession();

  const [loginError, setLoginError] = useState<LoginError | null>(null);

  const searchParams = useSearchParams();
  const error = searchParams.get("error") as LoginError;

  const methods = useForm<UserLoginForm>({
    resolver: zodResolver(CompanyFormRegistration),
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  useEffect(() => {
    setLoginError(error);
  }, [errors, error]);

  useEffect(() => {
    if (session?.user?.roles?.includes(RoleName.ADMIN)) {
      router.push("/back-office");
    } else if (session?.user) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, session?.user.roles]);

  const onSubmit: SubmitHandler<UserLoginForm> = async ({
    email,
    password,
  }) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      router.push(`/connexion?error=${res.error}`);
    } else if (res?.url) {
      router.push(res.url);
    }
  };

  return (
    <div className="container mx-auto w-full p-2">
      <h1 className="mt-6">Bienvenue !</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="py-10">
            {loginError ? (
              <h3 className="my-2 rounded-md py-1 text-center font-semibold text-error">
                {displayError[loginError] ||
                  "Nous ne réussissons pas à vous connecter veuillez réessayer plus tard"}
              </h3>
            ) : (
              ""
            )}

            <FormInput
              label="Email"
              id="email"
              name="email"
              placeholder="Ex. prenom.nom@votresociete.com"
              type="email"
              icon="/icons/mail.svg"
              tabIndex={1}
            />
            <FormInput
              label="Mot de passe"
              id="password"
              name="password"
              placeholder="Mot de passe"
              type="password"
              icon="/icons/lock.svg"
              tabIndex={2}
            />

            <div className="mt-6 flex flex-col">
              <Button
                color="blue"
                buttonType="submit"
                style={ButtonStyle.FILLED}
                disabled={!isValid}
                tabIndex={3}
                icon="/icons/arrow-right.svg"
              >
                Se connecter
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
