-- DropForeignKey
ALTER TABLE "quartiers" DROP CONSTRAINT "quartiers_survey_id_fkey";

-- AlterTable
ALTER TABLE "quartiers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "quartiers" ADD CONSTRAINT "quartiers_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
