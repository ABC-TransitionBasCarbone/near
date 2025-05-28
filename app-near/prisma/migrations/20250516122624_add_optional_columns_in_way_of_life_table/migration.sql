-- AlterTable
ALTER TABLE "way_of_life_answer" ALTER COLUMN "reasons_to_continue_using_car" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "reasons_to_eat_meat" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "reasons_to_not_buy_french_and_season_food" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "reasons_to_not_chose_second_hand" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "transport_mode_to_buy_food" DROP NOT NULL;
