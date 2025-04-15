/*
  Warnings:

  - Made the column `su_id` on table `carbon_footprint_answer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "carbon_footprint_answer" DROP CONSTRAINT "carbon_footprint_answer_su_id_fkey";

-- AlterTable
ALTER TABLE "carbon_footprint_answer" ALTER COLUMN "su_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "carbon_footprint_answer" ADD CONSTRAINT "carbon_footprint_answer_su_id_fkey" FOREIGN KEY ("su_id") REFERENCES "su_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
