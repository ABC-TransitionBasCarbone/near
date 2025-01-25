#  Comment initier une enquête et/ou mettre à jour les données de l'INSEE

## Ajouter un nouveau millésime des recensements de l'INSEE

### Prérequis

Installer postgresql-client pour pouvoir utiliser psql.

###  1. Télécharger le fichier INSEE

Disponible sur <https://www.insee.fr/fr/statistiques/8268806#consulter>

###  2. Créer une nouvelle table insee_iris_2022

- Créer un nouveau model InseeIris2022 dans `./prisma/schema.prisma` qui correspond au format csv téléchargé
- Lancer la migration dans postgresql :

```bash
npm run prisma migrate
```

Si nécéssaire, il faut ensuite mettre à jour les vues SQL du fichier `./scripts/load_survey_insee_stats.ts` pour que les enquêtes existantes utilisent le nouveau millésime.

### 3. Charger les données dans Postgres

Passer en paramètre du script `load_insee_data.sh` le csv de données afin de charger les données. Par exemple :

```bash
npm run load:insee -- "$(pwd)/scripts/base-ic-evol-struct-pop-2022.csv" postgresql://postgres:password@localhost:5432/app-near
```

## Ajouter une nouvelle enquête pour un nouveau quartier

Pour ajouter une nouvelle enquête, il faut modifier le script `./scripts/load_survey_insee_stats.ts` :

- Créer une nouvelle vue SQL similaire avec les IRIS correspondant au quartier en le liant à la BDD INSEE souhaitée dans le fichier TS
- Ajouter une nouvelle enquête dans la fonction `prisma.survey.upsert` en lui donnant un nom
- Exécuter le script

```bash
npm run load-surveys
```
