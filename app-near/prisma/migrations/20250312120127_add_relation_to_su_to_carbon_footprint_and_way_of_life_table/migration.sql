-- AlterTable
ALTER TABLE "carbon_footprint_answer" ADD COLUMN     "su_id" INTEGER;

-- AlterTable
ALTER TABLE "way_of_life_answer" ADD COLUMN     "su_id" INTEGER;

-- AddForeignKey
ALTER TABLE "way_of_life_answer" ADD CONSTRAINT "way_of_life_answer_su_id_fkey" FOREIGN KEY ("su_id") REFERENCES "su_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_footprint_answer" ADD CONSTRAINT "carbon_footprint_answer_su_id_fkey" FOREIGN KEY ("su_id") REFERENCES "su_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
