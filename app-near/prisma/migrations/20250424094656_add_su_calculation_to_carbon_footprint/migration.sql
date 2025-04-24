/*
  Warnings:

  - You are about to drop the column `email_api_called` on the `carbon_footprint_answer` table. All the data in the column will be lost.
  - Added the required column `know_su` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_local_consumption` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_waste_habits` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_preservation` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_construcion_soil_artificialization` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_electricity_solar_auto_consumption` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_hollidays_camping_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_hollidays_home_exchange_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_hollidays_hotel_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_hollidays_second_home_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_hollidays_tental_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_hollidays_youth_hostel_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_swimming_pool` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `services_market` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `services_publics` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_car_electric_consumption_100` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_car_km2` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_car_long_distance` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_car_oil_consumption_100` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_car_oil_type` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_hollidays_camping_car` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_hollidays_caravan` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_hollidays_cruise` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_hollidays_rental_vehicle` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_hollidays_van` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carbon_footprint_answer" DROP COLUMN "email_api_called",
ADD COLUMN     "air_travel_frequency" "AirTravelFrequency",
ADD COLUMN     "digital_intensity" "DigitalIntensity",
ADD COLUMN     "distance_to_barycenter" DOUBLE PRECISION,
ADD COLUMN     "heat_source" "HeatSource",
ADD COLUMN     "know_su" BOOLEAN NOT NULL,
ADD COLUMN     "meat_frequency" "MeatFrequency",
ADD COLUMN     "purchasing_strategy" "PurchasingStrategy",
ADD COLUMN     "transportation_mode" "TransportationMode",
DROP COLUMN "alimentation_local_consumption",
ADD COLUMN     "alimentation_local_consumption" DOUBLE PRECISION NOT NULL,
DROP COLUMN "alimentation_waste_habits",
ADD COLUMN     "alimentation_waste_habits" DOUBLE PRECISION NOT NULL,
DROP COLUMN "divers_preservation",
ADD COLUMN     "divers_preservation" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_construcion_soil_artificialization",
ADD COLUMN     "logement_construcion_soil_artificialization" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_electricity_solar_auto_consumption",
ADD COLUMN     "logement_electricity_solar_auto_consumption" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_hollidays_camping_impact",
ADD COLUMN     "logement_hollidays_camping_impact" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_hollidays_home_exchange_impact",
ADD COLUMN     "logement_hollidays_home_exchange_impact" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_hollidays_hotel_impact",
ADD COLUMN     "logement_hollidays_hotel_impact" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_hollidays_second_home_impact",
ADD COLUMN     "logement_hollidays_second_home_impact" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_hollidays_tental_impact",
ADD COLUMN     "logement_hollidays_tental_impact" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_hollidays_youth_hostel_impact",
ADD COLUMN     "logement_hollidays_youth_hostel_impact" DOUBLE PRECISION NOT NULL,
DROP COLUMN "logement_swimming_pool",
ADD COLUMN     "logement_swimming_pool" DOUBLE PRECISION NOT NULL,
DROP COLUMN "services_market",
ADD COLUMN     "services_market" DOUBLE PRECISION NOT NULL,
DROP COLUMN "services_publics",
ADD COLUMN     "services_publics" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_car_electric_consumption_100",
ADD COLUMN     "transportation_car_electric_consumption_100" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_car_km2",
ADD COLUMN     "transportation_car_km2" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_car_long_distance",
ADD COLUMN     "transportation_car_long_distance" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_car_oil_consumption_100",
ADD COLUMN     "transportation_car_oil_consumption_100" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_car_oil_type",
ADD COLUMN     "transportation_car_oil_type" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_hollidays_camping_car",
ADD COLUMN     "transportation_hollidays_camping_car" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_hollidays_caravan",
ADD COLUMN     "transportation_hollidays_caravan" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_hollidays_cruise",
ADD COLUMN     "transportation_hollidays_cruise" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_hollidays_rental_vehicle",
ADD COLUMN     "transportation_hollidays_rental_vehicle" DOUBLE PRECISION NOT NULL,
DROP COLUMN "transportation_hollidays_van",
ADD COLUMN     "transportation_hollidays_van" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "way_of_life_answer" RENAME COLUMN "has_su" TO "know_su";