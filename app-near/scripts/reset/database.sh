#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <DATABASE_URL>"
    echo "Example: $0 postgresql://username:password@host:port/app-near"
    echo "Reset data..."
fi

DATABASE_URL=${1:-"postgresql://postgres:password@localhost:5432/app-near"}

# table list to reset
TABLES="public.insee_iris_2021 public.surveys public.user"

for TABLE_NAME in $TABLES; do
    echo "Checking table ${TABLE_NAME}..."

    TABLE_EXISTS=$(psql "${DATABASE_URL}" -tAc "SELECT to_regclass('${TABLE_NAME}');")

    if [ "${TABLE_EXISTS}" != "null" ] && [ -n "${TABLE_EXISTS}" ]; then
        echo "Truncating table ${TABLE_NAME}..."
        psql "${DATABASE_URL}" -c "TRUNCATE TABLE ${TABLE_NAME} CASCADE;"
    else
        echo "Table ${TABLE_NAME} does not exist, skipping..."
    fi
done