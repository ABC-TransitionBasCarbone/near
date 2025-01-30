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

##  Comment charger la base de données INSEE des IRIS pour l'année 2021 ?

### 1. Télécharger le fichier et l'extraire dans ./scripts

Pour les données de l'INSEE 2021

```bash
curl -L -O https://www.insee.fr/fr/statistiques/fichier/8268806/base-ic-evol-struct-pop-2021_csv.zip && unzip base-ic-evol-struct-pop-2021_csv.zip && mv base-ic-evol-struct-pop-2021.CSV ./scripts/base-ic-evol-struct-pop-2021.csv && rm base-ic-evol-struct-pop-2021_csv.zip
```

## 2. Charger la BDD INSEE et initialiser une enquête pour le 14eme arrondissement de Paris

### En environnement local
```bash
npm run load:all
```

### En environnement de production (ou dockerisé) :

#### 2.1. Charger les données INSEE dans une base de données locale

```bash
npm run load:insee -- "$(pwd)/scripts/base-ic-evol-struct-pop-2021.csv" postgresql://postgres:password@localhost:5432/app-near
```

#### 2.2. Initialiser une enquête en base et calculer les données statistiques nécessaires à l'enquête

Le script utilise les variables du fichier `.env`

```bash
npm run load:surveys
```

Pour plus de détail sur :

- l'ajout d'un nouveau millésime de l'INSEE
- ou comment ajouter une enquête

voir le [README du dossier scripts](./scritps/README.md)
