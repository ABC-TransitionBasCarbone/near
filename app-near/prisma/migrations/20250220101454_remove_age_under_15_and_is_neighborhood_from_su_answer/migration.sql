/*
  Warnings:

  - The values [UNDER_15] on the enum `AgeCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_neighborhood_resident` on the `su_answer` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgeCategory_new" AS ENUM ('FROM_15_TO_29', 'FROM_30_TO_44', 'FROM_45_TO_59', 'FROM_60_TO_74', 'ABOVE_75');
ALTER TABLE "su_answer" ALTER COLUMN "age_category" TYPE "AgeCategory_new" USING ("age_category"::text::"AgeCategory_new");
ALTER TYPE "AgeCategory" RENAME TO "AgeCategory_old";
ALTER TYPE "AgeCategory_new" RENAME TO "AgeCategory";
DROP TYPE "AgeCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "su_answer" DROP COLUMN "is_neighborhood_resident";
