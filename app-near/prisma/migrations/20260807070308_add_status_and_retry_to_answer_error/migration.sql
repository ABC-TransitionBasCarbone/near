-- CreateEnum
CREATE TYPE "AnswerErrorStatus" AS ENUM ('ACTIVE', 'RESOLVED');

-- AlterTable
ALTER TABLE "raw_answer_error" ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "last_attempt_at" TIMESTAMP(3),
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "AnswerErrorStatus" NOT NULL DEFAULT 'ACTIVE';
