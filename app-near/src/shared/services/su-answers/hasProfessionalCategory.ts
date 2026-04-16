import { ProfessionalSituation } from "@prisma/client";

export const hasProfessionalCategory = (answer: {
  professionalSituation: ProfessionalSituation;
  professionalCategory?: unknown;
}) => {
  if (
    ProfessionalSituation.EMPLOYEE === answer.professionalSituation &&
    !answer.professionalCategory
  ) {
    return false;
  }
  return true;
};
