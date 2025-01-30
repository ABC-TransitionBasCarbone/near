/*
  Warnings:

  - The values [STEP_1_NEIGHBORHOOD_INFORMATION ] on the enum `SurveyPhase` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SurveyPhase_new" AS ENUM ('STEP_1_NEIGHBORHOOD_INFORMATION', 'STEP_2_SU_SURVERY', 'STEP_3_SU_EXPLORATION', 'STEP_4_ADDITIONAL_SURVEY', 'STEP_5_RESULTS');
ALTER TABLE "surveys" ALTER COLUMN "phase" DROP DEFAULT;
ALTER TABLE "surveys" ALTER COLUMN "phase" TYPE "SurveyPhase_new" USING ("phase"::text::"SurveyPhase_new");
ALTER TYPE "SurveyPhase" RENAME TO "SurveyPhase_old";
ALTER TYPE "SurveyPhase_new" RENAME TO "SurveyPhase";
DROP TYPE "SurveyPhase_old";
ALTER TABLE "surveys" ALTER COLUMN "phase" SET DEFAULT 'STEP_1_NEIGHBORHOOD_INFORMATION';
COMMIT;

-- AlterTable
ALTER TABLE "surveys" ALTER COLUMN "phase" SET DEFAULT 'STEP_1_NEIGHBORHOOD_INFORMATION';
