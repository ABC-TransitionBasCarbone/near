#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 <CSV_FILE_PATH> <DATABASE_URL>"
    echo "Example: $0 ./insee_iris_2021.csv postgresql://username:password@host:port/app-near"
    echo "Trying loading ./scripts/base-ic-evol-struct-pop-2021.csv file on localhost:5432/app-near..."
fi

CSV_FILE=${1:-"./scripts/load-insee/base-ic-evol-struct-pop-2021.csv"}
DATABASE_URL=${2:-"postgresql://postgres:password@localhost:5432/app-near"}

psql ${DATABASE_URL} --command "\copy public.insee_iris_2021 (iris, com, typ_iris, lab_iris, p21_pop, p21_pop0002, p21_pop0305, p21_pop0610, p21_pop1117, p21_pop1824, p21_pop2539, p21_pop4054, p21_pop5564, p21_pop6579, p21_pop80p, p21_pop0014, p21_pop1529, p21_pop3044, p21_pop4559, p21_pop6074, p21_pop75p, p21_pop0019, p21_pop2064, p21_pop65p, p21_poph, p21_h0014, p21_h1529, p21_h3044, p21_h4559, p21_h6074, p21_h75p, p21_h0019, p21_h2064, p21_h65p, p21_popf, p21_f0014, p21_f1529, p21_f3044, p21_f4559, p21_f6074, p21_f75p, p21_f0019, p21_f2064, p21_f65p, c21_pop15p, c21_pop15p_cs1, c21_pop15p_cs2, c21_pop15p_cs3, c21_pop15p_cs4, c21_pop15p_cs5, c21_pop15p_cs6, c21_pop15p_cs7, c21_pop15p_cs8, c21_h15p, c21_h15p_cs1, c21_h15p_cs2, c21_h15p_cs3, c21_h15p_cs4, c21_h15p_cs5, c21_h15p_cs6, c21_h15p_cs7, c21_h15p_cs8, c21_f15p, c21_f15p_cs1, c21_f15p_cs2, c21_f15p_cs3, c21_f15p_cs4, c21_f15p_cs5, c21_f15p_cs6, c21_f15p_cs7, c21_f15p_cs8, p21_pop_fr, p21_pop_etr, p21_pop_imm, p21_pmen, p21_phormen) FROM '${CSV_FILE}' DELIMITER ';' CSV HEADER QUOTE '\"' NULL 'NULL' ESCAPE '\"';"

if [ $? -eq 0 ]; then
    echo "Data successfully copied into the database."
else
    echo "An error occurred while copying data into the database."
    exit 1
fi