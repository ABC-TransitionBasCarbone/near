#!/bin/bash

read -p "Entrez l'URL de destination : " URL
read -p "Entrez la clé secrète : " SECRET
read -p "Entrez le nom du fichier JSON (ex: su.json) : " JSON_FILE

if [ ! -f "$JSON_FILE" ]; then
  echo "Fichier JSON introuvable : $JSON_FILE"
  exit 1
fi

PAYLOAD=$(cat "$JSON_FILE")

SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64)
HEADER_SIGNATURE="sha256=$SIGNATURE"

curl -X POST "$URL" \
     -H "Content-Type: application/json" \
     -H "Typeform-Signature: $HEADER_SIGNATURE" \
     -H "Ngc-Signature: $HEADER_SIGNATURE" \
     -d "$PAYLOAD" 