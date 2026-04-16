import { ProfessionalSituation } from "@prisma/client";
import { CurrentProfessionalCategory } from "../../../types/enums/professionalCategory";
import { hasProfessionalCategory } from "./hasProfessionalCategory";

describe("hasProfessionalCategory", () => {
  it("returns false when professionalSituation is EMPLOYEE and professionalCategory is missing", () => {
    expect(
      hasProfessionalCategory({
        professionalSituation: ProfessionalSituation.EMPLOYEE,
        professionalCategory: undefined,
      }),
    ).toBe(false);
  });

  it("returns true when professionalSituation is EMPLOYEE and professionalCategory is provided", () => {
    expect(
      hasProfessionalCategory({
        professionalSituation: ProfessionalSituation.EMPLOYEE,
        professionalCategory: CurrentProfessionalCategory.CS1,
      }),
    ).toBe(true);
  });

  it.each([
    ProfessionalSituation.STUDENT,
    ProfessionalSituation.STAY_AT_HOME,
    ProfessionalSituation.NOT_EMPLOYED,
    ProfessionalSituation.RETIRED,
  ])(
    "returns true when professionalSituation is %s regardless of professionalCategory",
    (professionalSituation) => {
      expect(
        hasProfessionalCategory({
          professionalSituation,
          professionalCategory: undefined,
        }),
      ).toBe(true);
    },
  );
});
