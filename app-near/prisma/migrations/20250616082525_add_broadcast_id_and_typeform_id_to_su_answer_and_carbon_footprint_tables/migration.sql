/*
  Warnings:

  - Added the required column `broadcast_id` to the `su_answer` table without a default vunknownalue. This is not possible if the table is not empty.
  - Added the required column `typeform_id` to the `su_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `broadcast_id` to the `way_of_life_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeform_id` to the `way_of_life_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "su_answer" ADD COLUMN     "broadcast_id" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "typeform_id" TEXT NOT NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE "way_of_life_answer" ADD COLUMN     "broadcast_id" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "typeform_id" TEXT NOT NULL DEFAULT 'unknown';
