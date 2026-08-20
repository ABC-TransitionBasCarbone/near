-- work_zone/hobby_zone/food_market_zone are plain String columns (Typeform
-- allows free-text answers there), never typed with the ZoneSelection enum.
UPDATE "way_of_life_answer" SET "work_zone" = 'ZONE_QUARTIER' WHERE "work_zone" = 'ZONE_PORTE_ORLEANS';
UPDATE "way_of_life_answer" SET "hobby_zone" = 'ZONE_QUARTIER' WHERE "hobby_zone" = 'ZONE_PORTE_ORLEANS';
UPDATE "way_of_life_answer" SET "food_market_zone" = 'ZONE_QUARTIER' WHERE "food_market_zone" = 'ZONE_PORTE_ORLEANS';

DROP TYPE "ZoneSelection";
