export enum ErrorCode {
  WRONG_SURVEY_PHASE = "WRONG_SURVEY_PHASE",
  MISSING_SURVEY_PHASE = "MISSING_SURVEY_PHASE",
  SU_NOT_COMPUTED = "SU_NOT_COMPUTED",
  SU_SEND_EMAIL = "SU_SEND_EMAIL",
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
};
