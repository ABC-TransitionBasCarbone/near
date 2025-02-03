#!/bin/bash

npm run prisma migrate deploy

ROW_COUNT=$(psql ${SCALINGO_POSTGRESQL_URL} -t -c "SELECT count(*) FROM public.insee_iris_2021;")

if [[ $ROW_COUNT -eq 0 ]]; then
    echo "Chargement des données INSEE 2021 ..."
    curl -L -O https://www.insee.fr/fr/statistiques/fichier/8268806/base-ic-evol-struct-pop-2021_csv.zip

    unzip base-ic-evol-struct-pop-2021_csv.zip

    mv base-ic-evol-struct-pop-2021.CSV ./scripts/base-ic-evol-struct-pop-2021.csv

    rm base-ic-evol-struct-pop-2021_csv.zip

    npm run load:insee -- "./scripts/base-ic-evol-struct-pop-2021.csv" ${SCALINGO_POSTGRESQL_URL}
else 
   echo "Les données INSEE 2021 sont déjà chargées"
fi


echo "Mise à jour des enquêtes ..."
npm run load:surveys

exit 0