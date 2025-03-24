export enum ErrorCode {
  WRONG_SURVEY_PHASE = "WRONG_SURVEY_PHASE",
  MISSING_SURVEY_PHASE = "MISSING_SURVEY_PHASE",
  SU_NOT_COMPUTED = "SU_NOT_COMPUTED",
  SU_SEND_EMAIL = "SU_SEND_EMAIL",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
  UNEXPECTED_COMPUTE_SU_ERROR = "UNEXPECTED_COMPUTE_SU_ERROR",
  WRONG_SURVEY_NAME = "WRONG_SURVEY_NAME",
  UNEXPECTED_NGCFORM = "UNEXPECTED_NGCFORM",
  NEIGHBORHOOD_NOT_FOUND = "NEIGHBORHOOD_NOT_FOUND",
}

export const errorCodeMapper: Record<ErrorCode, string> = {
  [ErrorCode.MISSING_SURVEY_PHASE]:
    "Vous n'êtes pas dans la bonne étape pour valider cette phase.",
  [ErrorCode.SU_NOT_COMPUTED]:
    "Vous devez d'abord calculter les sphères d'usages.",
  [ErrorCode.SU_SEND_EMAIL]:
    "Les emails n'ont pas été correctement envoyés, veuillez vous rapporcher du support pour déterminer l'impact.",
  [ErrorCode.WRONG_SURVEY_PHASE]:
    "Votre sondage n'est pas à une phase lui permettant de réaliser cette action.",
  [ErrorCode.UNEXPECTED_ERROR]: "An unexpected error occurred.",
  [ErrorCode.UNEXPECTED_COMPUTE_SU_ERROR]:
    "Une erreur inatentue pour computeSus s'est produite",
  [ErrorCode.WRONG_SURVEY_NAME]: "Vérifiez le survey name",
  [ErrorCode.UNEXPECTED_NGCFORM]: "Erreur inconnue sur le webhook ngcform",
  [ErrorCode.NEIGHBORHOOD_NOT_FOUND]: "Erreur, quartier non trouvé",
};
