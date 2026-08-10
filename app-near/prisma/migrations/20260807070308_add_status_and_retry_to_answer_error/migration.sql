-- CreateEnum
CREATE TYPE "AnswerErrorStatus" AS ENUM ('ACTIVE', 'RESOLVED');

-- AlterTable
ALTER TABLE "raw_answer_error" ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "last_attempt_at" TIMESTAMP(3),
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "AnswerErrorStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "external_id" TEXT,
ADD COLUMN     "comment" TEXT;

-- Backfill external_id from the raw payload already stored on existing rows
UPDATE "raw_answer_error"
SET "external_id" = "raw_payload" -> 'form_response' ->> 'token'
WHERE "answer_type" IN ('SU', 'WAY_OF_LIFE')
  AND "raw_payload" -> 'form_response' ->> 'token' IS NOT NULL;

UPDATE "raw_answer_error"
SET "external_id" = "raw_payload" ->> 'id'
WHERE "answer_type" = 'CARBON_FOOTPRINT'
  AND "raw_payload" ->> 'id' IS NOT NULL;

-- Collapse duplicate error rows created by Typeform's own webhook retries,
-- keeping only the most recently inserted row for each external_id
DELETE FROM "raw_answer_error" a
USING "raw_answer_error" b
WHERE a."external_id" IS NOT NULL
  AND a."external_id" = b."external_id"
  AND a."answer_type" = b."answer_type"
  AND a."id" < b."id";

-- CreateIndex
CREATE INDEX "raw_answer_error_external_id_answer_type_status_idx" ON "raw_answer_error"("external_id", "answer_type", "status");
