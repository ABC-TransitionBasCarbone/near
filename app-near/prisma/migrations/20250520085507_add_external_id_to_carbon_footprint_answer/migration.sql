/*
  Warnings:

  - You are about to drop the `ngc_contact` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `carbon_footprint_answer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `broadcast_id` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `external_id` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carbon_footprint_answer" ADD COLUMN     "broadcast_id" TEXT NOT NULL,
ADD COLUMN     "external_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "ngc_contact";

-- CreateIndex
CREATE UNIQUE INDEX "carbon_footprint_answer_external_id_key" ON "carbon_footprint_answer"("external_id");
