/*
  Warnings:

  - A unique constraint covering the columns `[iris]` on the table `insee_iris_2021` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "insee_iris_2021_iris_key" ON "insee_iris_2021"("iris");
