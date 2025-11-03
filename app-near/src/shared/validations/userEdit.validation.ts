import { z } from "zod";

export const userform = z.object({
  email: z
    .string()
    .email({ message: "Veuillez renseigner un email valide" })
    .min(1, { message: "Le champ email est obligatoire" }),
  surveyId: z.number().min(1, { message: "Veuillez renseigner un quartier" }),
});

export type UserForm = z.infer<typeof userform>;
