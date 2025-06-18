-- AlterTable
ALTER TABLE "su_answer" ADD COLUMN     "broadcast_id" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "typeform_id" TEXT NOT NULL DEFAULT 'unknown';

-- AlterTable
ALTER TABLE "way_of_life_answer" ADD COLUMN     "broadcast_id" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "typeform_id" TEXT NOT NULL DEFAULT 'unknown';
