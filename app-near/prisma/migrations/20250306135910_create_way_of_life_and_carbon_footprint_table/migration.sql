-- CreateTable
CREATE TABLE "way_of_life_answer" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "broadcast_channel" "BroadcastChanel" NOT NULL,
    "email_api_called" BOOLEAN DEFAULT false,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "way_of_life_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carbon_footprint_answer" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "broadcast_channel" "BroadcastChanel" NOT NULL,
    "email_api_called" BOOLEAN DEFAULT false,
    "surveyId" INTEGER NOT NULL,

    CONSTRAINT "carbon_footprint_answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "way_of_life_answer_email_key" ON "way_of_life_answer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "carbon_footprint_answer_email_key" ON "carbon_footprint_answer"("email");

-- AddForeignKey
ALTER TABLE "way_of_life_answer" ADD CONSTRAINT "way_of_life_answer_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_footprint_answer" ADD CONSTRAINT "carbon_footprint_answer_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
