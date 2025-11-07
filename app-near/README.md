# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## Comment installer le dépot localement ?

Utiliser la bonne version de node avec nvm :

```sh
nvm use
```

Installer des dépendances :

```sh
npm install
```

Configurer le pre commit hook :

```sh
npm run prepare
```

Lancer la base de données PostgreSQL :

```sh
docker-compose up -d
```

Créer un fichier .env :

```sh
cp .env.example .env
```

Générer une valeur pour AUTH_SECRET :

```sh
openssl rand -base64 32
```

Migrer la base de données :

```sh
npm run db:migrate
```

Exécuter l'application en local :

```sh
npm run dev
```

##  Comment initialiser l'application ?

### 1. Prérequis : Télécharger le fichier des données INSEE 2021 et l'extraire dans ./scripts

Pour les données de l'INSEE 2021

```bash
curl -L -O https://www.insee.fr/fr/statistiques/fichier/8268806/base-ic-evol-struct-pop-2021_csv.zip && unzip base-ic-evol-struct-pop-2021_csv.zip && mv base-ic-evol-struct-pop-2021.CSV ./scripts/base-ic-evol-struct-pop-2021.csv && rm base-ic-evol-struct-pop-2021_csv.zip
```

### 2. Initialiser l'application

#### 2.1 En environnement local

```bash
docker-compose up;

# or

docker compose up;
```
Au démarrage, les actions suivantes seront réalisées :
```bash
# Reset de la base de données
npm run data:reset "postgresql://postgres:password@database:5432/app-near";

# Ajout des données de l'insee précédemment téléchargées dans la table InseeIris2021
npm run load:insee -- "./scripts/load-insee/base-ic-evol-struct-pop-2021.csv" "postgresql://postgres:password@database:5432/app-near";

# Création du quartier "Porte d'Orléans"
npm run survey:create -- iris="751145501,751145503,751145601" surveyName="Porte d'Orléans";

# Création de l'utilisateur avec le rôle PILOTE pour le quartier "Porte d'Orléans";
npm run user:create -- role=PILOTE email=pilote@mail.com password=pilote surveyName="Porte d'Orléans";

# Création de l'utilisateur avec le rôle ADMIN
npm run user:create -- role=ADMIN email=admin@mail.com password=admin
```


#### 2.2 En environnement de production (ou dockerisé)

##### 2.2.1 Charger les données INSEE dans une base de données locale

```bash
npm run load:insee -- "$(pwd)/scripts/base-ic-evol-struct-pop-2021.csv" postgresql://postgres:password@localhost:5432/app-near
```

##### 2.2.2 Créer un utilisateur avec le rôle d'administration

```bash
npm run user:create -- role=ADMIN email=<email> password=<password>
```

##### 2.2.3 Initialiser une enquête en base et calculer les données statistiques nécessaires à l'enquête

###### 2.2.3.1 En utilisant le back-office (fortement recommandé)

Connectez vous en tant qu'administrateur, puis utilisez le back-office pour : 
- Créer un quartier
- Associer un utilisateur avec le rôle PILOTE à ce quartier

###### 2.2.3.2 Avec des scripts

```bash
# Création du quartier "Porte d'Orléans"
npm run survey:create -- iris="751145501,751145503,751145601" surveyName="Porte d'Orléans";

# Création de l'utilisateur avec le rôle PILOTE pour le quartier "Porte d'Orléans";
npm run user:create -- role=PILOTE email=pilote@mail.com password=pilote surveyName="Porte d'Orléans";

```

Les scripts utilisent les variables du fichier `.env`

## Comment créer des utilisateurs
```bash
npm run user:create -- email=<email> password=<password> role=<role> [surveyName=<surveyName>]

# email : mettre l'email de l'utilisateur à créer
# password : mettre le mot de passe de l'utilisateur à créer
# role : mettre un rôle valid (ADMIN ou PILOTE)
# surveyName : uniquement pour le rôle PILOTE, mettre un surveyName valid (par ex. "Porte d'Orléans")
```

## Comment tester les webhooks

```bash
./scripts/webhooks/query.sh <url> <secret> <json_file>

# Exemple pour les su:
#
# Without Prompt
# ./scripts/webhooks/query.sh localhost:3000/api/typeform typeform-secret ./scripts/webhooks/su.json
#
# With Prompt
# Entrez l'URL de destination : localhost:3000/api/typeform
# Entrez la clé secrète Typeform : typeform-secret
# Entrez le nom du fichier JSON (ex: su.json) : ./scripts/webhooks/su.json

# Exemple pour way of life:
#
# Without Prompt
# ./scripts/webhooks/query.sh localhost:3000/api/typeform typeform-secret ./scripts/webhooks/way-of-life.json
#
# With Prompt
# Entrez l'URL de destination : localhost:3000/api/typeform
# Entrez la clé secrète Typeform : typeform-secret
# Entrez le nom du fichier JSON (ex: su.json) : ./scripts/webhooks/way-of-life.json

# PROMPT (exemple pour les ngc):
#
# Without Prompt
# ./scripts/webhooks/query.sh localhost:3000/api/ngcform ngc-secret ./scripts/webhooks/ngc-known-su.json
# ./scripts/webhooks/query.sh localhost:3000/api/ngcform ngc-secret ./scripts/webhooks/ngc-unknown-su.json
#
# With Prompt
# Entrez l'URL de destination : localhost:3000/api/ngcform
# Entrez la clé secrète Typeform : ngc-secret
# Entrez le nom du fichier JSON (ex: su.json) : ./scripts/webhooks/ngc.json
# /!\ pour enregistrer un ngc, il faut une su valide. Donc d'abord jouer les su, puis dans le ngc.json saisir un suId valide
```

Note :

- su.json > exemple de payload pour le webhook sphère d'usage
- ngc*.json > exemples de payload pour le webhook ngcform
- way-of-life.json > exemples de payload pour le webhook mode de vie

## Comment jouer les seeds

Pour lister les différents scopes (scénario de seed) possibles :

```bash
npm run seed
```

Pour obtenir une définition des arguments attendus pour un scope :

```bash
npm run seed -- scope=su_answer
```

Pour jouer un scénario de seed (exemple pour les sphères d'usage) :

```bash
 npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=LESS_THAN_GLOBAL_TARGET
```

