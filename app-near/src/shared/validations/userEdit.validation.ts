import { z } from "zod";

export const userform = z.object({
  email: z.string().min(1, { message: "Veuillez renseigner un email" }),
  surveyId: z.string().min(1, { message: "Veuillez renseigner un quartier" }),
});

export type UserForm = z.infer<typeof userform>;
