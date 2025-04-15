/*
  Warnings:

  - Added the required column `alimentation` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_annual_breakfast` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_bonus` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_col_drinks` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_deforestation` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_drinks` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_hot_drinks` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_local_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_lunch_dinner` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_meals` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_seasonal_impact` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alimentation_waste` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answers` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_digital` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_digital_devices` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_digital_internet` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_furniture` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_furniture_deforestation` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_furniture_items` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_household_applicances` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_household_applicances_devices` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `divers_textile` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `global_note` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_air_conditioning` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_construcion` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_construcion_base` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_construcion_cooling` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_deforestation` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_electricity` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_electricity_carbon_intensity` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_heating` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_hollidays` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_outdor` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_renovation` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logement_total_consumption` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `services_societal` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_bicycle` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_car` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_ferry` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_hollidays` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_plane` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_public_transport` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_soft_mobility` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation_train` to the `carbon_footprint_answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carbon_footprint_answer" ADD COLUMN     "alimentation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_annual_breakfast" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_bonus" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_col_drinks" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_deforestation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_drinks" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_hot_drinks" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_local_consumption" TEXT,
ADD COLUMN     "alimentation_local_impact" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_lunch_dinner" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_meals" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_seasonal_impact" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_waste" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "alimentation_waste_habits" TEXT,
ADD COLUMN     "answers" JSONB NOT NULL,
ADD COLUMN     "divers" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_digital" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_digital_devices" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_digital_internet" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_furniture" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_furniture_deforestation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_furniture_items" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_household_applicances" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_household_applicances_devices" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "divers_preservation" TEXT,
ADD COLUMN     "divers_textile" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "global_note" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_air_conditioning" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_construcion" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_construcion_base" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_construcion_cooling" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_construcion_soil_artificialization" TEXT,
ADD COLUMN     "logement_deforestation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_electricity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_electricity_carbon_intensity" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_electricity_solar_auto_consumption" TEXT,
ADD COLUMN     "logement_heating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_hollidays" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_hollidays_camping_impact" TEXT,
ADD COLUMN     "logement_hollidays_home_exchange_impact" TEXT,
ADD COLUMN     "logement_hollidays_hotel_impact" TEXT,
ADD COLUMN     "logement_hollidays_second_home_impact" TEXT,
ADD COLUMN     "logement_hollidays_tental_impact" TEXT,
ADD COLUMN     "logement_hollidays_youth_hostel_impact" TEXT,
ADD COLUMN     "logement_outdor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_renovation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "logement_swimming_pool" TEXT,
ADD COLUMN     "logement_total_consumption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "services_market" TEXT,
ADD COLUMN     "services_publics" TEXT,
ADD COLUMN     "services_societal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_bicycle" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_car" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_car_electric_consumption_100" TEXT,
ADD COLUMN     "transportation_car_km2" TEXT,
ADD COLUMN     "transportation_car_long_distance" TEXT,
ADD COLUMN     "transportation_car_oil_consumption_100" TEXT,
ADD COLUMN     "transportation_car_oil_type" TEXT,
ADD COLUMN     "transportation_ferry" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_hollidays" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_hollidays_camping_car" TEXT,
ADD COLUMN     "transportation_hollidays_caravan" TEXT,
ADD COLUMN     "transportation_hollidays_cruise" TEXT,
ADD COLUMN     "transportation_hollidays_rental_vehicle" TEXT,
ADD COLUMN     "transportation_hollidays_van" TEXT,
ADD COLUMN     "transportation_plane" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_public_transport" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_soft_mobility" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation_train" DOUBLE PRECISION NOT NULL;
