/*
  Warnings:

  - You are about to drop the column `user_distance_to_su_barycentre` on the `su_answer` table. All the data in the column will be lost.
  - You are about to drop the column `user_su` on the `su_answer` table. All the data in the column will be lost.
  - Added the required column `su` to the `su_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "su_answer" DROP COLUMN "user_distance_to_su_barycentre",
DROP COLUMN "user_su",
ADD COLUMN     "distance_to_barycentre" DOUBLE PRECISION,
ADD COLUMN     "su" INTEGER NOT NULL;
