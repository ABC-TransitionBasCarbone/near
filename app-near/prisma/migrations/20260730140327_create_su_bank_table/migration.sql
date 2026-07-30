-- AlterTable
ALTER TABLE "su_data" ADD COLUMN     "su_bank_id" INTEGER;

-- CreateTable
CREATE TABLE "su_bank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color_main" TEXT NOT NULL,

    CONSTRAINT "su_bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "su_bank_name_key" ON "su_bank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "su_bank_color_main_key" ON "su_bank"("color_main");

-- AddForeignKey
ALTER TABLE "su_data" ADD CONSTRAINT "su_data_su_bank_id_fkey" FOREIGN KEY ("su_bank_id") REFERENCES "su_bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
