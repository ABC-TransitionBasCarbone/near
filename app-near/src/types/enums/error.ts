export enum ErrorCode {
  WRONG_SURVEY_PHASE = "WRONG_SURVEY_PHASE",
  MISSING_SURVEY_PHASE = "MISSING_SURVEY_PHASE",
  SU_NOT_COMPUTED = "SU_NOT_COMPUTED",
  SU_SEND_EMAIL = "SU_SEND_EMAIL",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  UNEXPECTED_COMPUTE_SU_ERROR = "UNEXPECTED_COMPUTE_SU_ERROR",
  MISSING_SURVEY_NAME = "MISSING_SURVEY_NAME",
  WRONG_SURVEY_NAME = "WRONG_SURVEY_NAME",
  UNEXPECTED_NGCFORM = "UNEXPECTED_NGCFORM",
  UNEXPECTED_NGCFORM_EMAIL = "UNEXPECTED_NGCFORM_EMAIL",
  NEIGHBORHOOD_NOT_FOUND = "NEIGHBORHOOD_NOT_FOUND",
  MISSING_FORM_ID = "MISSING_FORM_ID",
  WRONG_FORM_ID = "WRONG_FORM_ID",
  WRONG_SIGNATURE = "WRONG_SIGNATURE",
  SU_NOT_FOUND = "SU_NOT_FOUND",
  WRONG_BARYCENTRE_DATA = "WRONG_BARYCENTRE_DATA",
}

export const errorCodeMapper: Partial<Record<ErrorCode, string>> = {
  [ErrorCode.MISSING_SURVEY_PHASE]:
    "Vous n'êtes pas dans la bonne étape pour valider cette phase.",
  [ErrorCode.SU_NOT_COMPUTED]:
    "Vous devez d'abord calculter les sphères d'usages.",
  [ErrorCode.SU_SEND_EMAIL]:
    "Les emails n'ont pas été correctement envoyés, veuillez vous rapprocher du support pour déterminer l'impact.",
  [ErrorCode.WRONG_SURVEY_PHASE]:
    "Votre sondage n'est pas à une phase lui permettant de réaliser cette action.",
  [ErrorCode.UNEXPECTED_COMPUTE_SU_ERROR]:
    "Une erreur inattendue pour computeSus s'est produite",
};
