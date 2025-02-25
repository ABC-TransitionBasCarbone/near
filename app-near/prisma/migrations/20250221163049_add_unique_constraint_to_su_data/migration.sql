/*
  Warnings:

  - A unique constraint covering the columns `[survey_id,su]` on the table `su_data` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "su_data_survey_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "su_data_survey_id_su_key" ON "su_data"("survey_id", "su");
