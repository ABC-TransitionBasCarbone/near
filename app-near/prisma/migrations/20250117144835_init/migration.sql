-- CreateEnum
CREATE TYPE "SurveyPhase" AS ENUM ('ONE_INFORMATION_QUARTIER', 'TWO_SU_SURVERY', 'THREE_SU_EXPLORATION', 'FOUR_ADDITIONAL_SURVEY', 'FIVE_RESULTS');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "surveys" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phase" "SurveyPhase" NOT NULL DEFAULT 'ONE_INFORMATION_QUARTIER',

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insee_iris_2021" (
    "iris" VARCHAR(255) NOT NULL,
    "com" VARCHAR(255) NOT NULL,
    "typ_iris" VARCHAR(255) NOT NULL,
    "lab_iris" VARCHAR(255) NOT NULL,
    "p21_pop" DOUBLE PRECISION,
    "p21_pop0002" DOUBLE PRECISION,
    "p21_pop0305" DOUBLE PRECISION,
    "p21_pop0610" DOUBLE PRECISION,
    "p21_pop1117" DOUBLE PRECISION,
    "p21_pop1824" DOUBLE PRECISION,
    "p21_pop2539" DOUBLE PRECISION,
    "p21_pop4054" DOUBLE PRECISION,
    "p21_pop5564" DOUBLE PRECISION,
    "p21_pop6579" DOUBLE PRECISION,
    "p21_pop80p" DOUBLE PRECISION,
    "p21_pop0014" DOUBLE PRECISION,
    "p21_pop1529" DOUBLE PRECISION,
    "p21_pop3044" DOUBLE PRECISION,
    "p21_pop4559" DOUBLE PRECISION,
    "p21_pop6074" DOUBLE PRECISION,
    "p21_pop75p" DOUBLE PRECISION,
    "p21_pop0019" DOUBLE PRECISION,
    "p21_pop2064" DOUBLE PRECISION,
    "p21_pop65p" DOUBLE PRECISION,
    "p21_poph" DOUBLE PRECISION,
    "p21_h0014" DOUBLE PRECISION,
    "p21_h1529" DOUBLE PRECISION,
    "p21_h3044" DOUBLE PRECISION,
    "p21_h4559" DOUBLE PRECISION,
    "p21_h6074" DOUBLE PRECISION,
    "p21_h75p" DOUBLE PRECISION,
    "p21_h0019" DOUBLE PRECISION,
    "p21_h2064" DOUBLE PRECISION,
    "p21_h65p" DOUBLE PRECISION,
    "p21_popf" DOUBLE PRECISION,
    "p21_f0014" DOUBLE PRECISION,
    "p21_f1529" DOUBLE PRECISION,
    "p21_f3044" DOUBLE PRECISION,
    "p21_f4559" DOUBLE PRECISION,
    "p21_f6074" DOUBLE PRECISION,
    "p21_f75p" DOUBLE PRECISION,
    "p21_f0019" DOUBLE PRECISION,
    "p21_f2064" DOUBLE PRECISION,
    "p21_f65p" DOUBLE PRECISION,
    "c21_pop15p" DOUBLE PRECISION,
    "c21_pop15p_cs1" DOUBLE PRECISION,
    "c21_pop15p_cs2" DOUBLE PRECISION,
    "c21_pop15p_cs3" DOUBLE PRECISION,
    "c21_pop15p_cs4" DOUBLE PRECISION,
    "c21_pop15p_cs5" DOUBLE PRECISION,
    "c21_pop15p_cs6" DOUBLE PRECISION,
    "c21_pop15p_cs7" DOUBLE PRECISION,
    "c21_pop15p_cs8" DOUBLE PRECISION,
    "c21_h15p" DOUBLE PRECISION,
    "c21_h15p_cs1" DOUBLE PRECISION,
    "c21_h15p_cs2" DOUBLE PRECISION,
    "c21_h15p_cs3" DOUBLE PRECISION,
    "c21_h15p_cs4" DOUBLE PRECISION,
    "c21_h15p_cs5" DOUBLE PRECISION,
    "c21_h15p_cs6" DOUBLE PRECISION,
    "c21_h15p_cs7" DOUBLE PRECISION,
    "c21_h15p_cs8" DOUBLE PRECISION,
    "c21_f15p" DOUBLE PRECISION,
    "c21_f15p_cs1" DOUBLE PRECISION,
    "c21_f15p_cs2" DOUBLE PRECISION,
    "c21_f15p_cs3" DOUBLE PRECISION,
    "c21_f15p_cs4" DOUBLE PRECISION,
    "c21_f15p_cs5" DOUBLE PRECISION,
    "c21_f15p_cs6" DOUBLE PRECISION,
    "c21_f15p_cs7" DOUBLE PRECISION,
    "c21_f15p_cs8" DOUBLE PRECISION,
    "p21_pop_fr" DOUBLE PRECISION,
    "p21_pop_etr" DOUBLE PRECISION,
    "p21_pop_imm" DOUBLE PRECISION,
    "p21_pmen" DOUBLE PRECISION,
    "p21_phormen" DOUBLE PRECISION
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "surveys_name_key" ON "surveys"("name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
