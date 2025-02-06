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
CREATE TYPE "HeatSource" AS ENUM ('ELECTRICITY', 'GAZ', 'OIL');

-- CreateEnum
CREATE TYPE "BroadcastChanel" AS ENUM ('mail_campaign', 'social_network', 'qr_code', 'street_survey');

-- CreateTable
CREATE TABLE "su_answer" (
    "id" SERIAL NOT NULL,
    "is_neighborhood_resident" BOOLEAN NOT NULL,
    "age_category" "AgeCategory" NOT NULL,
    "gender" "Gender" NOT NULL,
    "professional_category" "ProfessionalCategory" NOT NULL,
    "easy_healt_access" "EasyHealthAccess" NOT NULL,
    "meat_frequency" "MeatFrequency" NOT NULL,
    "transportation_mode" "TransportationMode" NOT NULL,
    "digital_intensity" "DigitalIntensity" NOT NULL,
    "purchasing_strategy" "PurchasingStrategy" NOT NULL,
    "air_travel_frequency" "AirTravelFrequency" NOT NULL,
    "heat_source" "HeatSource" NOT NULL,
    "email" TEXT,
    "broadcast_channel" "BroadcastChanel" NOT NULL,
    "user_su" TEXT,
    "user_distance_to_su_barycentre" DOUBLE PRECISION,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "su_answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "su_answer_email_key" ON "su_answer"("email");

-- AddForeignKey
ALTER TABLE "su_answer" ADD CONSTRAINT "su_answer_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
