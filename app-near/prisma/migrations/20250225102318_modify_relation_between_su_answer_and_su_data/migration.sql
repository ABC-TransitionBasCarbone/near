/*
  Warnings:

  - You are about to drop the column `su` on the `su_answer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "su_answer" RENAME COLUMN "su" TO "su_id";

-- AddForeignKey
ALTER TABLE "su_answer" ADD CONSTRAINT "su_answer_su_id_fkey" FOREIGN KEY ("su_id") REFERENCES "su_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
