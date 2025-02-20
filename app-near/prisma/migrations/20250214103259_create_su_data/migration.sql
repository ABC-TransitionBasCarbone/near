-- CreateTable
CREATE TABLE "su_data" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "su" INTEGER NOT NULL,
    "pop_percentage" DOUBLE PRECISION NOT NULL,
    "barycenter" JSONB NOT NULL,

    CONSTRAINT "su_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "su_data_survey_id_key" ON "su_data"("survey_id");

-- AddForeignKey
ALTER TABLE "su_data" ADD CONSTRAINT "su_data_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
