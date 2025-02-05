-- CreateEnum
CREATE TYPE "AgeCategory" AS ENUM ('UNDER_15', 'FROM_15_TO_29', 'FROM_30_TO_44', 'FROM_45_TO_59', 'FROM_60_TO_74', 'ABOVE_75');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MAN', 'WOMAN');

-- CreateEnum
CREATE TYPE "ProfessionalCategory" AS ENUM ('CS1', 'CS2', 'CS3', 'CS4', 'CS5', 'CS6', 'CS7', 'CS8_unemployed', 'CS8_student', 'CS8_other');

-- CreateEnum
CREATE TYPE "EasyHealthAccess" AS ENUM ('EASY', 'MODERATE', 'HARD');

-- CreateEnum
CREATE TYPE "MeatFrequency" AS ENUM ('MINOR', 'REGULAR', 'MAJOR');

-- CreateEnum
CREATE TYPE "TransportationMode" AS ENUM ('CAR', 'PUBLIC', 'LIGHT');

-- CreateEnum
CREATE TYPE "DigitalIntensity" AS ENUM ('LIGHT', 'REGULAR', 'INTENSE');

-- CreateEnum
CREATE TYPE "PurchasingStrategy" AS ENUM ('NEW', 'MIXED', 'SECOND_HAND');

-- CreateEnum
CREATE TYPE "AirTravelFrequency" AS ENUM ('ZERO', 'FROM_1_TO_3', 'ABOVE_3');

-- CreateEnum
CREATE TYPE "EatSource" AS ENUM ('ELECTRICITY', 'GAZ', 'OIL');

-- CreateTable
CREATE TABLE "SuAnswer" (
    "id" SERIAL NOT NULL,
    "isNeighborhoodResident" BOOLEAN NOT NULL,
    "ageCategory" "AgeCategory" NOT NULL,
    "gender" "Gender" NOT NULL,
    "professionalCategory" "ProfessionalCategory" NOT NULL,
    "easyHealthAccess" "EasyHealthAccess" NOT NULL,
    "meatFrequency" "MeatFrequency" NOT NULL,
    "transportationMode" "TransportationMode" NOT NULL,
    "digitalIntensity" "DigitalIntensity" NOT NULL,
    "purchasingStrategy" "PurchasingStrategy" NOT NULL,
    "airTravelFrequency" "AirTravelFrequency" NOT NULL,
    "heatSource" "EatSource" NOT NULL,
    "email" TEXT,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "SuAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuAnswer_email_key" ON "SuAnswer"("email");

-- AddForeignKey
ALTER TABLE "SuAnswer" ADD CONSTRAINT "SuAnswer_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
