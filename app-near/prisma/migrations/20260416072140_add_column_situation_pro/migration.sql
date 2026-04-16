/*
  Warnings:

  - Added the required column `professional_situation` to the `su_answer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProfessionalSituation" AS ENUM ('EMPLOYEE', 'STUDENT', 'STAY_AT_HOME', 'NOT_EMPLOYED', 'RETIRED');

-- AlterTable
ALTER TABLE "su_answer" ADD COLUMN     "professional_situation" "ProfessionalSituation" NOT NULL;