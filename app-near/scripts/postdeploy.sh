#!/bin/bash

npm run prisma migrate deploy

curl -L -O https://www.insee.fr/fr/statistiques/fichier/8268806/base-ic-evol-struct-pop-2021_csv.zip

unzip base-ic-evol-struct-pop-2021_csv.zip

mv base-ic-evol-struct-pop-2021.CSV ./scripts/base-ic-evol-struct-pop-2021.csv

rm base-ic-evol-struct-pop-2021_csv.zip

npm run load:insee -- "./scripts/base-ic-evol-struct-pop-2021.csv" ${SCALINGO_POSTGRESQL_URL}

echo "Installing tsx..."

npm install tsx

npm run load:surveys

exit 0