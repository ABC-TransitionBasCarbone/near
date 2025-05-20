-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('SU', 'WAY_OF_LIFE', 'CARBON_FOOTPRINT');

-- CreateTable
CREATE TABLE "raw_answer_error" (
    "id" SERIAL NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "answer_type" "AnswerType" NOT NULL,

    CONSTRAINT "raw_answer_error_pkey" PRIMARY KEY ("id")
);
