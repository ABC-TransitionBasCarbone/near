/*
  Warnings:

  - Added the required column `updated_at` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `su_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `su_data` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `way_of_life_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carbon_footprint_answer" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "su_answer" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "su_data" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "way_of_life_answer" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
