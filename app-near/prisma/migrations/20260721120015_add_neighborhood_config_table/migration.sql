-- DropForeignKey
ALTER TABLE "quartiers" DROP CONSTRAINT "quartiers_survey_id_fkey";

-- AlterTable
ALTER TABLE "quartiers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "neighborhood_config" (
    "id" SERIAL NOT NULL,
    "north_close_location" TEXT,
    "north_distant_location" TEXT,
    "sud_close_location" TEXT,
    "sud_distant_location" TEXT,
    "east_close_location" TEXT,
    "east_distant_location" TEXT,
    "west_close_location" TEXT,
    "west_distant_location" TEXT,
    "survey_id" INTEGER NOT NULL,

    CONSTRAINT "neighborhood_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "neighborhood_config_survey_id_key" ON "neighborhood_config"("survey_id");

-- AddForeignKey
ALTER TABLE "neighborhood_config" ADD CONSTRAINT "neighborhood_config_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quartiers" ADD CONSTRAINT "quartiers_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
