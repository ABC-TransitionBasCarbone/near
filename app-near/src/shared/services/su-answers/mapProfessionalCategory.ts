import { ProfessionalCategory, ProfessionalSituation } from "@prisma/client";

export const mapProfessionalCategoryFromSituation = (
  situation: ProfessionalSituation,
  employeeCategory: ProfessionalCategory,
): ProfessionalCategory => {
  switch (situation) {
    case ProfessionalSituation.RETIRED:
      return ProfessionalCategory.CS7;
    case ProfessionalSituation.STUDENT:
      return ProfessionalCategory.CS8_student;
    case ProfessionalSituation.STAY_AT_HOME:
      return ProfessionalCategory.CS8_home;
    case ProfessionalSituation.NOT_EMPLOYED:
      return ProfessionalCategory.CS8_unemployed;
    default:
      return employeeCategory;
  }
};
