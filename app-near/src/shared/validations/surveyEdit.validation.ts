import { z } from "zod";

export const surveyForm = z.object({
  name: z.string().min(1, { message: "Veuillez renseigner un nom" }),
  iris: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .min(1, { message: "Veuillez saisir au moins un code iris" }), // to complete
});

export type SurveyForm = z.infer<typeof surveyForm>;
