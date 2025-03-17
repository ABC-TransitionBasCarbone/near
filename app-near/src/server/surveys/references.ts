import {
  AgeCategory,
  AirTravelFrequency,
  DigitalIntensity,
  EasyHealthAccess,
  Gender,
  HeatSource,
  MeatFrequency,
  ProfessionalCategory,
  PurchasingStrategy,
  TransportationMode,
} from "@prisma/client";
import { env } from "~/env";

export const surveySUReferencesMapping: Record<string, string | boolean> = {
  // isNeighborhoodResident
  ["6226e10f-baf0-43f8-af05-2cddc649f509"]: true,
  ["3a347ad6-7461-4549-8cf3-d45167702a74"]: false,
  // ageCategory
  ["e56029c8-f14a-45dc-8a90-4e61a0f45581"]: AgeCategory.FROM_15_TO_29,
  ["58756e59-7741-4e9b-8d7b-c16c8eca4361"]: AgeCategory.FROM_30_TO_44,
  ["e1d0ef1b-5caa-4b62-aed0-f8efa82131b3"]: AgeCategory.FROM_45_TO_59,
  ["65b4afe2-e818-456e-b9fe-a5082a9abc79"]: AgeCategory.FROM_60_TO_74,
  ["fa4746bb-223c-4bbc-8a39-ff07a2246a0b"]: AgeCategory.ABOVE_75,
  // gender
  ["191de28b-587d-4f34-b57f-b687c77e1c1e"]: Gender.WOMAN,
  ["1caec0f3-6a02-42e6-9bf7-10030b6d38b6"]: Gender.MAN,
  ["9ac0fb83-a344-44d4-a235-add149bb6de3"]: Gender.OTHER,
  // professionalCategory
  ["34937a02-6445-4624-9d37-06158160fedc"]: ProfessionalCategory.CS1,
  ["392aa02d-894f-4359-96e3-dbe902090974"]:
    ProfessionalCategory.CS2_platform_entrepreneurship,
  ["eafa75de-50ee-42b5-8a49-9edc5a665d5c"]: ProfessionalCategory.CS2,
  ["a69d126e-0436-4b3d-b1b7-ba39af69354f"]: ProfessionalCategory.CS3,
  ["d8ff03ac-c2e7-4db7-a4ba-dd1162d31d0d"]: ProfessionalCategory.CS4,
  ["1f383874-b1ba-4b95-84ca-5bb735afb1f3"]: ProfessionalCategory.CS5,
  ["1af27fdf-88ac-4a0c-ae42-3961c1509763"]: ProfessionalCategory.CS6,
  ["144ee3b6-cc45-4c8a-bd6b-d507579a8a27"]: ProfessionalCategory.CS7,
  ["c72b89cf-162b-422c-a55c-cd831494fcfb"]: ProfessionalCategory.CS8_unemployed,
  ["a18b427c-ab45-4534-ad45-326c142a7869"]: ProfessionalCategory.CS8_student,
  ["db5c0ae8-772d-430a-84d6-b6a44026a25c"]: ProfessionalCategory.CS8_home,
  // easyHealthAccess
  ["2360d7d5-b501-4f3e-b829-4b374483849e"]: EasyHealthAccess.EASY,
  ["bd25627f-8aa4-4c43-a013-635e5af4cee0"]: EasyHealthAccess.MODERATE,
  ["9fe68244-2af7-49a0-a9e1-7d5e73878953"]: EasyHealthAccess.HARD,
  // meatFrequency
  ["3beb39cf-2cee-4c3b-81fb-8dd1b1ea3f00"]: MeatFrequency.MINOR,
  ["f3d254c4-0b61-4aa4-9df4-a631475787d6"]: MeatFrequency.REGULAR,
  ["6884a62e-bc9f-47af-8e28-7ea4a27f0230"]: MeatFrequency.MAJOR,
  // transportationMode
  ["8719d78b-30c6-4ef4-b7c4-a4627f594502"]: TransportationMode.CAR,
  ["45402959-78d9-4518-b3c3-ab5d3e4c1feb"]: TransportationMode.PUBLIC,
  ["7612df4d-5cb3-484c-8026-030331c61b3a"]: TransportationMode.LIGHT,
  // digitalIntensity
  ["270e40f2-2aa5-43b2-b9d9-0cadd018442c"]: DigitalIntensity.LIGHT,
  ["8b1e124f-a5d2-4a02-9383-3ef0e5aa7cf9"]: DigitalIntensity.REGULAR,
  ["f04dfe0c-f517-403e-883a-bb8c9de80de8"]: DigitalIntensity.INTENSE,
  // purchasingStrategy
  ["84702054-4b2e-40c9-932a-3bd813d5d646"]: PurchasingStrategy.NEW,
  ["13c4b137-28c3-4cca-ae27-6b228fb52f37"]: PurchasingStrategy.MIXED,
  ["8166cf94-e353-4b46-a522-acd9530782c0"]: PurchasingStrategy.SECOND_HAND,
  // airTravelFrequency
  ["22c056f4-21e7-4e63-8fb6-60b1f5569f8b"]: AirTravelFrequency.ZERO,
  ["e9c48d61-16c8-41a4-a53e-e8d838c539be"]: AirTravelFrequency.FROM_1_TO_3,
  ["04385aba-ae3e-4bda-b32b-1f0c03bec5b8"]: AirTravelFrequency.ABOVE_3,
  // heatSource
  ["6a3d2558-6612-4cf1-90a6-e5e1bf3bbca8"]: HeatSource.ELECTRICITY,
  ["60220a76-eacb-435d-beb9-30c6e139827c"]: HeatSource.GAZ,
  ["8d91547d-f2aa-4987-9d0b-cb3ce17527c5"]: HeatSource.OIL,
};

// TODO NEAR-45 update when form finalized
export const surveyWayOfLifeReferencesMapping: Record<
  string,
  string | boolean
> = {
  // isNeighborhoodResident > example to update
  ["6226e10f-baf0-43f8-af05-2cddc649f509"]: true,
  ["3a347ad6-7461-4549-8cf3-d45167702a74"]: false,
};

export const getReferencesMapping = (
  formId: string,
): Record<string, string | boolean> | undefined => {
  let referencesMapping: Record<string, string | boolean> | undefined;
  if (formId === env.SU_FORM_ID) {
    referencesMapping = surveySUReferencesMapping;
  }

  if (formId === env.WAY_OF_LIFE_FORM_ID) {
    referencesMapping = surveyWayOfLifeReferencesMapping;
  }

  return referencesMapping;
};
