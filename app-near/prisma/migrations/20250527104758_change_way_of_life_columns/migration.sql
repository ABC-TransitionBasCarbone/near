/*
  Warnings:

  - The values [I_PREFER_INDUSTRIAL_FOOD] on the enum `ReasonsToNotBuyFrenchSeasonFood` will be removed. If these variants are still used in the database, this will fail.
  - The values [CONFORT_OR_INDEPENDANCE] on the enum `ReasonsUsingCar` will be removed. If these variants are still used in the database, this will fail.
  - The values [NOT_CONCERNED] on the enum `WishesChoices` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `access_to_food_service_satisfaction` on the `way_of_life_answer` table. All the data in the column will be lost.
  - You are about to drop the column `action_when_too_cold` on the `way_of_life_answer` table. All the data in the column will be lost.
  - You are about to drop the column `action_when_too_hot` on the `way_of_life_answer` table. All the data in the column will be lost.
  - You are about to drop the column `capacity_to_share_idea_to_town_all` on the `way_of_life_answer` table. All the data in the column will be lost.
  - You are about to drop the column `idea_easy_talk` on the `way_of_life_answer` table. All the data in the column will be lost.
  - You are about to drop the column `professional_category` on the `way_of_life_answer` table. All the data in the column will be lost.
  - Made the column `transport_mode_to_buy_food` on table `way_of_life_answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transport_mode_to_work` on table `way_of_life_answer` required. This step will fail if there are existing NULL values in that column.

*/
-- Remove data
DELETE FROM way_of_life_answer;

-- AlterEnum
ALTER TYPE "ReasonsToEatMeat" ADD VALUE 'NOT_CONCERNED';

-- AlterEnum
BEGIN;
CREATE TYPE "ReasonsToNotBuyFrenchSeasonFood_new" AS ENUM ('PRICE', 'COMPLICATED_LABELS', 'I_DONT_KNOW_MARKET', 'I_DONT_KNOW_SEASON_PRODUCTS', 'I_PREFER_EAT_OTHER_PRODUCTS');
ALTER TYPE "ReasonsToNotBuyFrenchSeasonFood" RENAME TO "ReasonsToNotBuyFrenchSeasonFood_old";
ALTER TYPE "ReasonsToNotBuyFrenchSeasonFood_new" RENAME TO "ReasonsToNotBuyFrenchSeasonFood";
DROP TYPE "ReasonsToNotBuyFrenchSeasonFood_old";
COMMIT;

-- AlterEnum
ALTER TYPE "ReasonsToNotChoseSecondHand" ADD VALUE 'NOT_CONCERNED';

-- AlterEnum
BEGIN;
CREATE TYPE "ReasonsUsingCar_new" AS ENUM ('HANDICAP_REASONS', 'I_NEED_CAR_FOR_SOME_ACTIONS', 'SECURITY_REASONS', 'MY_WORK', 'PROFESSIONAL_OR_PERSONAL_IMAGE', 'NO_PUBLIC_TRANSPORT_AT_PROXIMITY', 'NOT_CONCERNED');
ALTER TYPE "ReasonsUsingCar" RENAME TO "ReasonsUsingCar_old";
ALTER TYPE "ReasonsUsingCar_new" RENAME TO "ReasonsUsingCar";
DROP TYPE "ReasonsUsingCar_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "WishesChoices_new" AS ENUM ('NO', 'I_WISH_BUT_CANT', 'I_WISH_AND_IT_IS_PLAN', 'YES_I_DO');
ALTER TABLE "way_of_life_answer" ALTER COLUMN "want_to_reduce_car_usage" TYPE "WishesChoices_new" USING ("want_to_reduce_car_usage"::text::"WishesChoices_new");
ALTER TABLE "way_of_life_answer" ALTER COLUMN "want_to_reduce_meat_and_fish" TYPE "WishesChoices_new" USING ("want_to_reduce_meat_and_fish"::text::"WishesChoices_new");
ALTER TABLE "way_of_life_answer" ALTER COLUMN "prefer_buy_french_and_season_food" TYPE "WishesChoices_new" USING ("prefer_buy_french_and_season_food"::text::"WishesChoices_new");
ALTER TABLE "way_of_life_answer" ALTER COLUMN "prefer_second_and" TYPE "WishesChoices_new" USING ("prefer_second_and"::text::"WishesChoices_new");
ALTER TYPE "WishesChoices" RENAME TO "WishesChoices_old";
ALTER TYPE "WishesChoices_new" RENAME TO "WishesChoices";
DROP TYPE "WishesChoices_old";
COMMIT;

-- AlterTable
ALTER TABLE "way_of_life_answer" DROP COLUMN "access_to_food_service_satisfaction",
DROP COLUMN "action_when_too_cold",
DROP COLUMN "action_when_too_hot",
DROP COLUMN "capacity_to_share_idea_to_town_all",
DROP COLUMN "idea_easy_talk",
DROP COLUMN "professional_category",
ALTER COLUMN "food_market_zone" DROP NOT NULL,
ALTER COLUMN "hobby_zone" DROP NOT NULL,
ALTER COLUMN "transport_mode_to_buy_food" SET NOT NULL,
ALTER COLUMN "transport_mode_to_work" SET NOT NULL,
ALTER COLUMN "transport_time_to_buy_food" DROP NOT NULL,
ALTER COLUMN "transport_time_to_hobby" DROP NOT NULL;

-- DropEnum
DROP TYPE "ActionWhenTooCold";

-- DropEnum
DROP TYPE "ActionWhenTooHot";