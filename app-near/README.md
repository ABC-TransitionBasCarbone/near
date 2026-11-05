# app-near

Application web de Near : interface des pilotes et administrateurs, API tRPC, réception des webhooks Typeform et NGC, scripts d'exploitation. Projet [T3 Stack](https://create.t3.gg/) : Next.js 15 (App Router), tRPC, Prisma/PostgreSQL, NextAuth, MUI + Tailwind.

Vue d'ensemble du projet et de l'architecture : [README racine](../README.md). Conventions de code : [CLAUDE.md](CLAUDE.md).

## Sommaire

- [Installation locale](#comment-installer-le-dépot-localement-)
- [Initialiser l'application](#comment-initialiser-lapplication-)
- [Créer des utilisateurs](#comment-créer-des-utilisateurs)
- [Typeform et code](#typeform-et-code)
- [near-survey et NGC](#near-survey-et-ngc)
- [Modifier un questionnaire Typeform](#modifier-un-questionnaire-typeform)
- [Tester les webhooks](#comment-tester-les-webhooks)
- [Lister et rejouer les webhooks en erreur](#comment-lister-et-rejouer-les-webhooks-en-erreur)
- [Récupérer des soumissions SU perdues à cause de la phase](#récupérer-des-soumissions-su-perdues-à-cause-de-la-phase)
- [Rejouer des données en erreur en production (procédure Scalingo)](#rejouer-des-données-en-erreur-en-production-procédure-scalingo)
- [Seeds](#comment-jouer-les-seeds)
- [Tests, lint et qualité](#tests-lint-et-qualité)
- [Maintenance des dépendances](#maintenance-des-dépendances)
- [Conventions et abréviations](#conventions-et-abréviations)

## Comment installer le dépot localement ?

Pour lancer l'ensemble de la stack (base + app + api-su) d'un coup, voir [Installation et lancement avec Docker Compose](../README.md#installation-et-lancement-avec-docker-compose). Ce qui suit concerne le développement sur app-near avec Node en local.

Utiliser la bonne version de node avec nvm (voir `.nvmrc`) :

```sh
nvm install
nvm use
```

Le projet utilise Node **24.22.2**, également utilisé par Docker et la CI (qui lit `.nvmrc`). Pour en faire la version par défaut des nouveaux shells :

```sh
nvm alias default 24.22.2
```

Installer des dépendances :

```sh
npm install
```

Configurer le pre commit hook (husky, lance `npm run lint`) :

```sh
npm run prepare
```

Lancer la base de données PostgreSQL (depuis la racine du repo) :

```sh
docker compose up database -d
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

Pour utiliser le calcul des sphères d'usage en local, lancer aussi api-su (`docker compose up api-su -d` depuis la racine, avec `api-su/.env` créé) : `API_SU_URL` et `API_SU_KEY` du `.env` doivent pointer dessus (`API_SU_URL=http://localhost:5000` quand app-near tourne hors Docker).

### Variables d'environnement

Elles sont toutes déclarées et validées dans [src/env.js](src/env.js) (l'application refuse de démarrer si l'une manque) et exemplifiées dans [.env.example](.env.example). Quand vous en ajoutez une : `src/env.js`, `.env.example`, et le [docker-compose.yml](../docker-compose.yml) si nécessaire.

| Groupe | Variables | Remarques |
| --- | --- | --- |
| Auth | `AUTH_SECRET`, `AUTH_URL` | `AUTH_SECRET` obligatoire en production |
| Base | `DATABASE_URL` | |
| Typeform | `TYPEFORM_SECRET`, `SU_FORM_ID`, `WAY_OF_LIFE_FORM_ID`, `NEXT_PUBLIC_TYPEFORM_*_LINK` / `_STAT` | Voir [Typeform et code](#typeform-et-code) |
| NGC / near-survey | `NGC_SECRET`, `NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK` | Secret de signature des webhooks `/api/ngcform*` ; le lien pointe vers le questionnaire near-survey |
| api-su | `API_SU_URL`, `API_SU_KEY` | `API_SU_KEY` identique côté api-su |
| Metabase | `METABASE_SECRET_KEY`, `METABASE_SITE_URL`, `NEXT_PUBLIC_METABASE_*` | Les `NEXT_PUBLIC_METABASE_*` sont les numéros des dashboards/questions embarqués |
| E-mails | `EMAIL_SERVICE` (`local` ou `brevo`), `BREVO_API_KEY` | `local` n'envoie rien |
| Divers | `NEXT_PUBLIC_TARGET_PERCENTAGE_WARNING`, `NEXT_PUBLIC_CONTACT_EMAIL`, `SEEDS_ENABLED` | |

Les variables `NEXT_PUBLIC_*` sont figées dans le bundle au **build** : après modification en production, il faut redéployer, pas seulement redémarrer.

## Comment initialiser l'application ?

### 1. Prérequis : télécharger le fichier des données INSEE 2021

Le fichier (~55 Mo, ignoré par git) doit être placé dans `scripts/load-insee/` sous le nom `base-ic-evol-struct-pop-2021.csv` :

```bash
cd scripts/load-insee
curl -L -O https://www.insee.fr/fr/statistiques/fichier/8268806/base-ic-evol-struct-pop-2021_csv.zip
unzip base-ic-evol-struct-pop-2021_csv.zip
mv base-ic-evol-struct-pop-2021.CSV base-ic-evol-struct-pop-2021.csv
rm base-ic-evol-struct-pop-2021_csv.zip meta_base-ic-evol-struct-pop-2021.CSV
cd ../..
```

En production, `scripts/postdeploy.sh` (exécuté par Scalingo après chaque déploiement) applique les migrations et initialise la banque de SU. Voir aussi [scripts/load-insee/README.md](scripts/load-insee/README.md).

### 2. Initialiser l'application

#### 2.1 En environnement local

```bash
docker compose up
```

(depuis la racine du repo ; prérequis et étapes manuelles dans le [README racine](../README.md#installation-et-lancement-avec-docker-compose)). Au démarrage, les actions suivantes sont réalisées, **à chaque démarrage** :

```bash
# Reset de la base de données (tables insee_iris_2021, surveys, user)
npm run data:reset "postgresql://postgres:password@database:5432/app-near";

# Ajout des données de l'insee dans la table InseeIris2021
npm run load:insee -- "./scripts/load-insee/base-ic-evol-struct-pop-2021.csv" "postgresql://postgres:password@database:5432/app-near";

# Création du quartier "Porte d'Orléans"
npm run survey:create -- iris="751145501,751145503,751145601" surveyName="Porte d'Orléans";

# Création de l'utilisateur avec le rôle PILOTE pour le quartier "Porte d'Orléans";
npm run user:create -- role=PILOTE email=pilote@mail.com password=pilote surveyName="Porte d'Orléans";

# Création de l'utilisateur avec le rôle ADMIN
npm run user:create -- role=ADMIN email=admin@mail.com password=admin

# Banque de noms/couleurs de sphères d'usage
npm run su-bank:init
```

#### 2.2 En environnement de production (ou dockerisé)

##### 2.2.1 Charger les données INSEE dans la base

```bash
npm run load:insee -- "$(pwd)/scripts/load-insee/base-ic-evol-struct-pop-2021.csv" postgresql://postgres:password@localhost:5432/app-near
```

##### 2.2.2 Créer un utilisateur avec le rôle d'administration

```bash
npm run user:create -- role=ADMIN email=<email> password=<password>
```

##### 2.2.3 Initialiser une enquête en base et calculer les données statistiques nécessaires à l'enquête

###### 2.2.3.1 En utilisant le back-office (fortement recommandé)

Connectez vous en tant qu'administrateur, puis utilisez le back-office pour :

- Créer un quartier (menu *Quartiers*)
- Créer l'utilisateur avec le rôle PILOTE de ce quartier (menu *Utilisateurs*, voir [Comment créer des utilisateurs](#comment-créer-des-utilisateurs))

###### 2.2.3.2 Avec des scripts

```bash
# Création du quartier "Porte d'Orléans"
npm run survey:create -- iris="751145501,751145503,751145601" surveyName="Porte d'Orléans";

# Création de l'utilisateur avec le rôle PILOTE pour le quartier "Porte d'Orléans";
npm run user:create -- role=PILOTE email=pilote@mail.com password=pilote surveyName="Porte d'Orléans";
```

Les scripts utilisent les variables du fichier `.env`.

## Comment créer des utilisateurs

### Par le back-office (recommandé)

Un administrateur connecté peut créer des utilisateurs **PILOTE** depuis le back-office, menu *Utilisateurs* (`/back-office/utilisateurs`) : il saisit l'e-mail et choisit le quartier (l'enquête) du pilote. L'application génère un mot de passe temporaire (haché en base) et l'affiche **une seule fois** dans une fenêtre, à copier et à communiquer à la personne. C'est la méthode à privilégier : pas d'accès à la base ni à Scalingo nécessaire, le mot de passe est aléatoire, et l'e-mail déjà utilisé est refusé.

Les quartiers se créent de la même façon dans le menu *Quartiers* (voir [Initialiser l'application](#comment-initialiser-lapplication-)).

Limite : le back-office ne crée que des pilotes. Les comptes **ADMIN** ne peuvent être créés que par le script ci-dessous.

### Par script (création d'un administrateur, local, dépannage)

```bash
npm run user:create -- email=<email> password=<password> role=<role> [surveyName=<surveyName>]

# email : mettre l'email de l'utilisateur à créer
# password : mettre le mot de passe de l'utilisateur à créer
# role : mettre un rôle valid (ADMIN ou PILOTE)
# surveyName : uniquement pour le rôle PILOTE, mettre un surveyName valid (par ex. "Porte d'Orléans")
```

En production, le script s'exécute dans un conteneur one-off : `scalingo --region osc-fr1 --app near-netzerocities run bash`, puis la commande ci-dessus. Le mot de passe passe en argument de ligne de commande : choisissez-en un fort et faites-le changer ou rotater ensuite si possible.

## Typeform et code

Les questionnaires (sphères d'usage, mode de vie) vivent **dans Typeform** (SaaS). Le code n'a aucune copie des questions : il reçoit chaque réponse complète par **webhook** et la traduit vers des colonnes de base de données. Tout le « contrat » entre Typeform et le code tient en quatre éléments : l'URL du webhook, les *ref* des questions, les *ref* des choix, et les champs cachés.

### Configuration côté Typeform

Pour chacun des deux formulaires (SU et mode de vie), dans Typeform : *Connect → Webhooks* :

| Réglage | Valeur |
| --- | --- |
| Destination URL | `https://<domaine app-near>/api/typeform` (identique pour les deux formulaires) |
| Secret | Valeur de `TYPEFORM_SECRET` |
| Webhook activé | oui |

Côté app-near, `SU_FORM_ID` et `WAY_OF_LIFE_FORM_ID` sont les identifiants des formulaires (visibles dans l'URL d'édition de Typeform). C'est eux qui permettent au code de savoir à quel questionnaire appartient un payload ([helpers.ts](src/server/typeform/helpers.ts) `getFormIdType`). Un `form_id` inconnu est rejeté. Les liens publics diffusés aux habitants sont `NEXT_PUBLIC_TYPEFORM_SU_LINK`, `NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK`…

**Champs cachés (*hidden fields*) obligatoires** dans chaque formulaire, alimentés par l'URL de diffusion générée par l'application :

| Champ caché | Rôle |
| --- | --- |
| `neighborhood` | Nom **exact** de l'enquête (quartier) en base ; sinon `survey not found`. |
| `broadcast_channel` | Canal de diffusion : `mail_campaign`, `social_network`, `qr_code` ou `street_survey` (enum `BroadcastChannel`). |
| `broadcast_id` | Identifiant du lien de diffusion. |

### Ce qui se passe quand une réponse arrive

`POST /api/typeform` ([route.ts](src/app/api/typeform/route.ts)) → [handleTypeformAnswer.ts](src/server/typeform/handleTypeformAnswer.ts) :

1. Le corps est parsé et validé (schéma Zod du webhook Typeform, [src/types/Typeform.ts](src/types/Typeform.ts)).
2. La signature HMAC SHA-256 (en-tête `Typeform-Signature`) est vérifiée avec `TYPEFORM_SECRET` ([signature.ts](src/server/typeform/signature.ts)).
3. **Conversion** ([convert.ts](src/server/typeform/convert.ts)) : chaque réponse devient une paire `clé → valeur` :
   - la **clé** est la *reference* de la **question** Typeform (`field.ref`), par exemple `ageCategory` ;
   - la **valeur** d'une question à choix est obtenue en cherchant la *reference* du **choix** (`choice.ref`, un UUID) dans les tables de correspondance de [src/server/surveys/references.ts](src/server/surveys/references.ts) (`surveySUReferencesMapping`, `surveyWayOfLifeReferencesMapping`), qui donnent la valeur d'enum Prisma (`AgeCategory.FROM_15_TO_29`…) ;
   - les questions texte, e-mail, nombre et oui/non sont prises telles quelles ; une réponse « Autre » saisie en texte libre est conservée telle quelle.
4. Règles de filtrage (réponse **ignorée avec un code 200**, rien n'est enregistré) : l'habitant ne vit pas dans le quartier (`isNeighborhoodResident` ≠ `true`) ; il a moins de 15 ans (`ageCategory` hors enum).
5. **Validation** Zod ([src/types/SuAnswer.ts](src/types/SuAnswer.ts) pour le questionnaire SU, [src/types/WayOfLifeAnswer.ts](src/types/WayOfLifeAnswer.ts) pour le mode de vie). Les clés inconnues du schéma sont **ignorées** silencieusement ; les clés attendues absentes ou invalides font échouer la validation.
6. Contrôle de la **phase de l'enquête** (questionnaire SU uniquement : phases 1 et 2 acceptées ; hors phase : code 200, rien d'enregistré, simple trace dans les logs, voir [la procédure de récupération](#récupérer-des-soumissions-su-perdues-à-cause-de-la-phase)).
7. Enregistrement en base (`su_answer` ou `way_of_life_answer`) dans [src/server/su/answers/create.ts](src/server/su/answers/create.ts) ou [src/server/way-of-life/create.ts](src/server/way-of-life/create.ts). L'enregistrement est **idempotent** : le `token` Typeform est stocké dans `typeformId`, une réponse déjà connue n'est pas dupliquée (on peut donc rejouer sans risque).
8. En cas d'erreur à n'importe quelle étape après le parsing JSON, le payload brut est enregistré dans la table **`raw_answer_error`** (statut `ACTIVE`) et peut être [rejoué](#comment-lister-et-rejouer-les-webhooks-en-erreur) une fois la cause corrigée. Quand un rejeu réussit, l'erreur est marquée résolue.

Le webhook d'empreinte carbone (`POST /api/ngcform`, émis par l'application near-survey) suit le même principe avec `NGC_SECRET` et l'en-tête `Ngc-Signature` : voir [near-survey et NGC](#near-survey-et-ngc).

### Où trouver les *ref* d'un questionnaire

- **Question** : dans l'éditeur Typeform, réglages de la question → *Question reference*. Elle doit être renseignée à la main et doit valoir exactement le nom de la propriété du schéma Zod (`ageCategory`, `meatFrequency`…). Une réponse dont la question n'a pas de *ref* est ignorée.
- **Choix** : Typeform génère un UUID par choix, il n'est pas affiché dans l'éditeur. Le plus simple est de le lire dans un payload de webhook : chaque payload contient `form_response.definition.fields[].choices[].ref` (voir [scripts/webhooks/su.json](scripts/webhooks/su.json)) ; on peut en obtenir un en répondant au formulaire (le payload est visible dans les logs applicatifs `[webhook]` ou dans Typeform → *Connect → Webhooks → View deliveries*), ou via l'API Typeform `GET https://api.typeform.com/forms/<form_id>` avec un jeton personnel.

## near-survey et NGC

Le questionnaire d'**empreinte carbone** ne passe pas par Typeform : il est porté par une autre application, **near-survey** (dépôt séparé, application Scalingo `near-survey`, non versionnée dans ce repo), basée sur Nos Gestes Climat. Elle appelle deux routes d'app-near, toutes deux authentifiées par une signature HMAC SHA-256 dans l'en-tête `Ngc-Signature`, calculée avec `NGC_SECRET` (le même secret doit être configuré dans near-survey) :

| Route | Code | Rôle |
| --- | --- | --- |
| `POST /api/ngcform` | [handleCarbonFootprintAnswer.ts](src/server/carbon-footprint/handleCarbonFootprintAnswer.ts) | Reçoit le résultat complet du calcul d'empreinte et l'enregistre dans `carbon_footprint_answer` |
| `POST /api/ngcform/emails` | [handleCarbonFootprintEmail.ts](src/server/carbon-footprint/handleCarbonFootprintEmail.ts) | Reçoit `{ id, email }`, rattache l'e-mail à la réponse déjà enregistrée et envoie la notification pour la suite (questionnaire mode de vie) |

Traitement de `/api/ngcform` :

1. Validation du corps (`NgcWebhookSchema`, [src/types/CarbonFootprint.ts](src/types/CarbonFootprint.ts)) : `id` (identifiant unique côté near-survey, stocké en `externalId`), `neighborhoodId` (nom **exact** de l'enquête en base), `broadcastChannel`, `broadcastId`, `calculatedResults` (résultats par poste : transport, alimentation, logement…) et `answers`.
2. Vérification de la signature (`401` sinon), puis recherche de l'enquête.
3. Conversion ([convert.ts](src/server/carbon-footprint/convert.ts)) : les réponses sont traduites en valeurs d'enum Prisma (viande, transport, chauffage…) et les résultats en colonnes.
4. Enregistrement idempotent sur `externalId` ([create.ts](src/server/carbon-footprint/create.ts)), avec rattachement à une **sphère d'usage** calculée (`getCalculatedSuParams`, qui appelle api-su `/assign`) : l'enquête doit donc avoir ses SU calculées, sinon aucune SU n'est rattachée.
5. En cas d'erreur, le payload est enregistré dans `raw_answer_error` (type `CARBON_FOOTPRINT`) et se rejoue avec `npm run webhooks:replay -- type=CARBON_FOOTPRINT` (voir [rejeu](#comment-lister-et-rejouer-les-webhooks-en-erreur)).

Les autres opérations suivent donc le même principe que pour Typeform, mais le « contrat » se trouve dans le code de near-survey : toute modification du format du payload (nouvelle question, nouveau poste de résultat) doit être faite **des deux côtés** — `NgcWebhookSchema`, `convert.ts`, le modèle `CarbonFootprintAnswer` de [prisma/schema.prisma](prisma/schema.prisma) et `convertedCarbonFootprintAnswer` pour app-near ; le dépôt near-survey pour l'émetteur. Ajouter d'abord le champ en optionnel côté app-near, déployer, puis déployer near-survey.

Tester en local : [Comment tester les webhooks](#comment-tester-les-webhooks) (`ngc-known-su.json`, `ngc-unknown-su.json`).

## Modifier un questionnaire Typeform

Règle d'or : **le code et le formulaire Typeform doivent évoluer ensemble**, et l'ordre compte. En production, des habitants répondent en continu : un décalage entre les deux fait échouer des soumissions (elles seront alors dans `raw_answer_error` et pourront être rejouées, mais autant l'éviter). Toujours tester sur un environnement local avec un payload réaliste (`scripts/webhooks/*.json`, voir [Tester les webhooks](#comment-tester-les-webhooks)).

### Méthode recommandée : travailler sur une copie du formulaire

Dupliquer un formulaire Typeform **conserve les *references*** des questions et des choix. C'est donc la bonne manière de préparer une évolution sans perturber la production, qui continue à fonctionner avec l'ancienne version du formulaire pendant tout le développement :

1. **Dupliquer** le formulaire existant dans Typeform (SU ou mode de vie).
2. **Faire les modifications** sur le formulaire dupliqué (questions, choix, textes), en respectant les règles des cas ci-dessous. Dans les réglages du doublon, vérifier la présence des champs cachés (`neighborhood`, `broadcast_channel`, `broadcast_id`) et configurer son webhook (URL `/api/typeform` et secret `TYPEFORM_SECRET`, voir [Configuration côté Typeform](#configuration-côté-typeform)), car ils ne sont pas forcément repris à l'identique.
3. **Répercuter les changements dans le code** (schéma Prisma et migration, `references.ts`, schéma Zod, tests, voir les cas ci-dessous) et le tester en local avec un payload du formulaire dupliqué, par exemple sur un environnement local avec `SU_FORM_ID` pointant vers le doublon.
4. **À la mise en production** : déployer le code, puis mettre à jour les variables d'environnement pour utiliser le doublon : `SU_FORM_ID` ou `WAY_OF_LIFE_FORM_ID` (identifiant du formulaire) et les liens de diffusion `NEXT_PUBLIC_TYPEFORM_SU_LINK`, `NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK` (et `NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_STAT` le cas échéant). Les variables `NEXT_PUBLIC_*` étant figées au build, **redéployer** après modification. Le mappage `form_id → type` ne gère qu'un seul formulaire par type : après bascule, l'ancien formulaire n'est plus reconnu et ses soumissions sont rejetées (`WRONG_FORM_ID`, conservées dans `raw_answer_error`).
5. Vérifier avec une réponse de test que `npm run webhooks:list-errors` reste vide, puis archiver ou désactiver l'ancien formulaire (le conserver quelque temps permet de revenir en arrière en remettant les anciennes variables).

Attention à la différence : dupliquer un **formulaire entier** conserve les *references*, mais dupliquer une **question** à l'intérieur d'un formulaire, ou supprimer puis recréer un choix, génère de nouveaux identifiants.

Dans les cas ci-dessous, « SU » désigne le questionnaire sphères d'usage ; le mode de vie fonctionne pareil avec `WayOfLifeAnswer`, `convertedWayOfLifeAnswer` et `surveyWayOfLifeReferencesMapping`.

### Modifier le texte d'une question ou d'un libellé de choix

Aucun impact sur le code : le code ne lit ni les titres ni les libellés, uniquement les *ref*. Il suffit de modifier dans Typeform **sans toucher** à la *Question reference* et en **éditant** (sans supprimer/recréer) les choix.

> Supprimer puis recréer un choix, ou dupliquer une question dans un formulaire, génère de nouveaux UUID : les anciens ne sont plus reconnus et les réponses échouent (`undefined` → rejet par Zod). Si cela arrive, mettre à jour `references.ts` avec les nouveaux UUID.

### Ajouter une nouvelle question

1. **Typeform** : créer la question, renseigner sa *Question reference* (nom de propriété en camelCase, ex. `newQuestion`). Ne **pas encore publier** si la question est obligatoire (voir ordre de déploiement ci-dessous).
2. **Base de données** ([prisma/schema.prisma](prisma/schema.prisma)) : ajouter la colonne au modèle `SuAnswer` (avec `@map("snake_case")`), et un `enum` Prisma si c'est une question à choix. Rendre la colonne **optionnelle** (`?`) : les réponses déjà en base n'ont pas de valeur.
3. **Migration** : `npm run db:generate` (exécute `prisma migrate dev`, crée le dossier de migration dans `prisma/migrations/` et régénère le client Prisma). Committer la migration. En production, `postdeploy.sh` l'applique.
4. **Mapping des choix** ([references.ts](src/server/surveys/references.ts)) : pour une question à choix, ajouter une entrée par choix `["<uuid du choix>"]: MonEnum.VALEUR,` (groupées sous un commentaire portant le nom de la question).
5. **Validation** ([src/types/SuAnswer.ts](src/types/SuAnswer.ts)) : ajouter la propriété au schéma Zod (`z.nativeEnum(MonEnum)` ou `z.string()`), `.optional()` tant que vous voulez accepter l'absence.
6. **Tests et jeux de données** : ajouter la question dans `scripts/webhooks/su.json` (ou `way-of-life.json`), dans `src/server/test-utils/create-data/suAnswer.ts` et dans les tests de [handleTypeformAnswer.spec.ts](src/server/typeform/handleTypeformAnswer.spec.ts).
7. **Exploitation de la donnée** : selon l'usage, ajouter la colonne dans les exports ([src/server/su/answers/export.ts](src/server/su/answers/export.ts)), les dataviz (`src/server/su/dataviz/`, composants `Dv*`) et vérifier les requêtes Metabase (qui lisent directement les tables).
8. Si la question entre dans le **calcul des sphères d'usage** (les 6 variables : viande, transport, numérique, achats, avion, chauffage), c'est un changement d'algorithme : [src/server/external-api/convert.ts](src/server/external-api/convert.ts) et [api-su](../api-su/README.md) (`constants.py`, `clustering.py`). À traiter à part, les résultats de SU ne sont plus comparables d'un quartier à l'autre.

**Ordre de déploiement recommandé** : (a) merger et déployer le code avec colonne et schéma optionnels ; (b) publier la modification dans Typeform ; (c) vérifier qu'une réponse de test passe (`raw_answer_error` doit rester vide, voir `npm run webhooks:list-errors`) ; (d) seulement si besoin, rendre la question obligatoire côté code.

### Modifier les choix de réponse d'une question

- **Ajouter un choix** : ajouter la valeur à l'`enum` Prisma (migration SQL `ALTER TYPE ... ADD VALUE`, générée par `npm run db:generate`), ajouter l'UUID du nouveau choix dans `references.ts`, mettre à jour les endroits qui énumèrent les valeurs (dataviz, traductions/libellés d'affichage, et pour une variable du calcul des SU, les tables de [convert.ts](src/server/external-api/convert.ts)). Déployer avant de publier le choix dans Typeform.
- **Renommer un choix** (libellé) : Typeform uniquement.
- **Supprimer un choix** : le retirer dans Typeform uniquement. **Ne pas** supprimer l'entrée de `references.ts` ni la valeur d'enum : les réponses historiques les utilisent, et un rejeu de `raw_answer_error` en aurait besoin. Retirer une valeur d'enum n'est possible qu'après avoir migré les lignes concernées.
- **Fusionner deux choix** : deux UUID peuvent pointer vers la même valeur dans `references.ts`.

### Supprimer une question

Cas vécu : `easyHealthAccess` a été rendue facultative dans Typeform alors qu'elle était obligatoire en base, et toutes les réponses sans cette valeur ont été rejetées (voir [la procédure de rejeu](#rejouer-des-données-en-erreur-en-production-procédure-scalingo)). Donc :

1. **Avant** de retirer la question de Typeform, rendre la propriété `.optional()` dans le schéma Zod **et** nullable (`?`) dans Prisma (migration), déployer.
2. Retirer ensuite la question dans Typeform. Les clés inconnues sont de toute façon ignorées par le schéma Zod.
3. Ne **pas** supprimer la colonne tant que des analyses (Metabase, exports) ou des réponses historiques l'utilisent. Si vous la supprimez : migration Prisma, retirer le champ de `references.ts`, de `src/types/*Answer.ts`, des exports/dataviz, des jeux de test, et vérifier les questions Metabase qui la lisent. Faire une sauvegarde avant.

### Modifier ou supprimer des réponses déjà enregistrées

- **Pas d'interface** pour éditer ou supprimer une réponse individuelle ; cela se fait en SQL (`su_answer`, `way_of_life_answer`) sur la base de production : `scalingo --region osc-fr1 --app near-netzerocities pgsql-console`. Faire une **sauvegarde** auparavant (Scalingo propose des backups manuels de l'addon PostgreSQL).
- Supprimer ou modifier une réponse dans Typeform **ne se répercute pas** dans Near : le webhook n'est appelé qu'à la soumission.
- Si les sphères d'usage ont déjà été calculées (phase 3), modifier/supprimer des réponses SU ne les met pas à jour : le recalcul n'est possible que pendant la phase 3 (`computeSu` dans [src/server/su/computeSu.ts](src/server/su/computeSu.ts) la refuse sinon). Une fois l'enquête passée en phase 4 (« Continuer l'enquête », qui envoie aussi les e-mails aux répondants), les sphères d'usage sont figées dans l'application : toute correction demande une intervention manuelle en base, et les e-mails déjà envoyés ne peuvent pas être repris.
- Pour *corriger* une réponse qui a été rejetée plutôt que modifier la base, préférer le [rejeu](#comment-lister-et-rejouer-les-webhooks-en-erreur) après correction du code ou du mapping.

## Comment tester les webhooks

```bash
./scripts/webhooks/query.sh <url> <secret> <json_file>

# Exemple pour les su:
#
# Without Prompt
# ./scripts/webhooks/query.sh localhost:3000/api/typeform typeform-secret ./scripts/webhooks/su.json | jq
#
# With Prompt
# Entrez l'URL de destination : localhost:3000/api/typeform
# Entrez la clé secrète Typeform : typeform-secret
# Entrez le nom du fichier JSON (ex: su.json) : ./scripts/webhooks/su.json

# Exemple pour way of life:
#
# Without Prompt
# ./scripts/webhooks/query.sh localhost:3000/api/typeform typeform-secret ./scripts/webhooks/way-of-life.json
#
# With Prompt
# Entrez l'URL de destination : localhost:3000/api/typeform
# Entrez la clé secrète Typeform : typeform-secret
# Entrez le nom du fichier JSON (ex: su.json) : ./scripts/webhooks/way-of-life.json

# PROMPT (exemple pour les ngc):
#
# Without Prompt
# ./scripts/webhooks/query.sh localhost:3000/api/ngcform ngc-secret ./scripts/webhooks/ngc-known-su.json
# ./scripts/webhooks/query.sh localhost:3000/api/ngcform ngc-secret ./scripts/webhooks/ngc-unknown-su.json
#
# With Prompt
# Entrez l'URL de destination : localhost:3000/api/ngcform
# Entrez la clé secrète Typeform : ngc-secret
# Entrez le nom du fichier JSON (ex: su.json) : ./scripts/webhooks/ngc.json
# /!\ pour enregistrer un ngc, il faut une su valide. Donc d'abord jouer les su, puis dans le ngc.json saisir un suId valide
```

Note :

- su.json > exemple de payload pour le webhook sphère d'usage
- ngc\*.json > exemples de payload pour le webhook ngcform
- way-of-life.json > exemples de payload pour le webhook mode de vie
- Le champ caché `neighborhood` des payloads doit correspondre à une enquête existante (`Porte d'Orléans` en local avec Docker Compose).
- Rejouer deux fois le même payload ne crée pas de doublon (même `token` Typeform) : changer `form_response.token` pour créer une nouvelle réponse.

## Comment lister et rejouer les webhooks en erreur

Quand un webhook (Typeform ou NGC) échoue, son payload brut est sauvegardé en base (table `raw_answer_error`). Deux scripts permettent de lister ces erreurs et de les rejouer :

```bash
# Lister les erreurs actives
npm run webhooks:list-errors -- [type=SU|WAY_OF_LIFE|CARBON_FOOTPRINT]

# Rejouer une erreur précise
npm run webhooks:replay -- id=<id>

# Rejouer toutes les erreurs actives
npm run webhooks:replay -- all=true [type=SU|WAY_OF_LIFE|CARBON_FOOTPRINT]

# Rejouer toutes les erreurs actives d'une enquête donnée
npm run webhooks:replay -- surveyName=<surveyName> [type=SU|WAY_OF_LIFE|CARBON_FOOTPRINT]
```

Note : si `surveyName` ne correspond à aucune enquête, le script affiche la liste des noms d'enquêtes valides.

## Récupérer des soumissions SU perdues à cause de la phase

Pour le questionnaire SU, la seule phase qui accepte la création d'une réponse est la phase 2 (la phase 1 est aussi acceptée par le code). Il est cependant possible de revenir en arrière dans les phases : une réponse arrivant hors phase est alors rejetée sans être une « erreur » au sens strict, donc **elle n'est pas enregistrée dans `raw_answer_error`**. Le webhook répond 200, rien n'est sauvegardé, et seule une ligne de log applicatif subsiste : `<enquête> step <phase> is over for <enquête>`, accompagnée du payload (log `[webhook]`).

Deux scripts permettent de les récupérer dans les logs et de les rejouer, séparément de `raw_answer_error` :

```bash
# 1. Extraire les payloads perdus d'un fichier de log vers un JSON exploitable
# (opération de lecture seule, sans écriture en base, idempotente)
npm run webhooks:recover-from-logs -- file=<chemin vers le fichier de log> [out=<chemin du json, défaut scripts/webhooks/recovered-su-payloads.json>]

# 2. Rejouer les payloads du fichier extrait (mêmes options que webhooks:replay)
npm run webhooks:replay-from-file -- file=<chemin du json> id=<id>
npm run webhooks:replay-from-file -- file=<chemin du json> all=true
npm run webhooks:replay-from-file -- file=<chemin du json> surveyName=<surveyName>
```

Pour que le rejeu fonctionne, l'enquête doit être dans une phase qui accepte les réponses SU (phase 1 ou 2), sinon la réponse est de nouveau refusée. En production, voir la procédure complète ci-dessous.

## Rejouer des données en erreur en production (procédure Scalingo)

Cas traité à l'origine : pour le quartier « Barnufles-Coeur de Ville - Martinets-Le Plateau », des réponses Typeform ne s'étaient pas enregistrées, pour deux raisons :

- **Champ `easyHealthAccess`** : devenu facultatif dans Typeform mais resté obligatoire en base, toute réponse sans ce champ était rejetée par l'API. Ces erreurs sont tracées dans `raw_answer_error` et rejouables.
- **Phase de l'enquête** : pour le formulaire SU, seule la phase 2 autorise la création de réponses, alors qu'on peut revenir à la phase 1. Ces réponses ne sont **pas** dans `raw_answer_error` (voir ci-dessus) ; il faut les reconstituer à partir des logs applicatifs.

D'autres enquêtes et types de questionnaire peuvent présenter des erreurs : adapter `surveyName` et `type` et rejouer la procédure.

**Prérequis** : [CLI Scalingo](https://doc.scalingo.com/cli) installée et connectée (`scalingo login`) avec un compte ayant accès à l'application `near-netzerocities`. Corriger d'abord la cause de l'erreur dans le code (par exemple rendre le champ facultatif, voir [Supprimer une question](#supprimer-une-question)) et la déployer, sinon le rejeu échouera de nouveau.

1. **Récupérer les logs Scalingo dans un fichier** (nécessaire seulement pour les erreurs de phase) :

   ```sh
   scalingo --region osc-fr1 --app near-netzerocities logs --lines 1000000000 > app.log
   ```

2. **Démarrer un conteneur one-off** de l'application en y envoyant le fichier de logs (le fichier est déposé dans `/tmp/uploads/`) :

   ```sh
   scalingo --region osc-fr1 --app near-netzerocities run --file ./app.log bash
   ```

   Les commandes suivantes sont à exécuter **dans ce conteneur**.

3. **Rejouer les erreurs enregistrées en base** (`raw_answer_error`) pour le quartier concerné :

   ```sh
   npm run webhooks:replay -- surveyName="Barnufles-Coeur de Ville - Martinets-Le Plateau" type=SU
   ```

   Il est conseillé de lister d'abord (`npm run webhooks:list-errors`) pour vérifier le périmètre.

4. **Reconstituer les erreurs liées à la phase** : extraire un fichier JSON de tous les payloads perdus depuis les logs :

   ```sh
   npm run webhooks:recover-from-logs -- file=/tmp/uploads/app.log out=recovered-su-payloads.json
   ```

5. **Rejouer les lignes correspondant au quartier** :

   ```sh
   npm run webhooks:replay-from-file -- file=recovered-su-payloads.json surveyName="Barnufles-Coeur de Ville - Martinets-Le Plateau"
   ```

6. Quitter le conteneur (`exit`). Les fichiers du conteneur one-off sont perdus à sa fermeture.

## Comment jouer les seeds

Les seeds ne s'exécutent que si `SEEDS_ENABLED` est vrai (jamais en production).

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

## Tests, lint et qualité

| Commande | Rôle |
| --- | --- |
| `npm run check` | `next lint` + `tsc --noEmit` |
| `npm run format:check` / `format:write` | Prettier |
| `npm run test:server` | Tests serveur (routers tRPC, services, webhooks), nécessitent la base PostgreSQL |
| `npm run test:shared` | Tests des utilitaires partagés |
| `npm run test:components` | Tests des composants React |
| `npm run build` | Build de production |

Les trois suites de tests ont des configurations Jest distinctes (`jest.*.config.mjs`) ; détails et conventions dans [CLAUDE.md](CLAUDE.md). La CI ([app-near-ci.yml](../.github/workflows/app-near-ci.yml)) exécute installation, `prisma db push`, tests, lint et build sur chaque pull request.

Commandes base de données :

| Commande | Rôle |
| --- | --- |
| `npm run db:migrate` | Applique les migrations existantes (`prisma migrate deploy`), à utiliser en prod/CI/local |
| `npm run db:generate` | Crée une nouvelle migration à partir de `schema.prisma` (`prisma migrate dev`) et régénère le client |
| `npm run db:push` | Synchronise le schéma sans migration (jetable, jamais sur une base à conserver) |
| `npm run db:studio` | Interface Prisma Studio |

## Maintenance des dépendances

Ces procédures sont à dérouler régulièrement (par exemple chaque trimestre) et dès qu'une alerte de sécurité tombe. Travailler sur une branche dédiée, avec la version de Node de `.nvmrc` et le npm indiqué par `packageManager` dans `package.json` (une version différente de npm réécrit le `package-lock.json` autrement).

### Analyse de sécurité

```sh
npm audit                  # toutes les dépendances
npm audit --omit=dev       # uniquement ce qui part en production
npm audit fix              # applique les correctifs compatibles (semver)
```

- Commencer par `--omit=dev` : les vulnérabilités des dépendances de développement (jest, eslint…) ne sont pas exposées en production.
- `npm audit fix --force` applique des changements **incompatibles** : ne pas l'utiliser en aveugle, mettre à jour le paquet concerné à la main et valider (voir ci-dessous).
- Pour comprendre d'où vient une dépendance vulnérable : `npm ls <paquet>`.
- Si aucun correctif n'existe, documenter la décision (risque accepté ou contournement) dans la pull request.

Au 4 novembre 2026, `npm audit --omit=dev` signale notamment `zod` (via `@t3-oss/env-*`), `postcss` (embarqué par `next`) et `@faker-js/faker`, dont la correction demande des montées de version majeures : à traiter.

### Mise à jour des dépendances

```sh
npm outdated               # versions actuelle / compatible (Wanted) / dernière (Latest)
npm update                 # mises à jour compatibles avec les plages du package.json
npx npm-check-updates -i   # (optionnel) choix interactif, y compris les montées majeures
```

1. **Mineures et correctifs** (colonne *Wanted*) : `npm update`, puis vérifications.
2. **Montées majeures** (*Latest* > *Wanted*) : une dépendance à la fois, en lisant ses notes de version. Sont à manier avec précaution dans ce projet : `next` (tester le build et le runtime), `@prisma/client` et `prisma` (toujours monter les deux ensemble, vérifier les migrations), `next-auth` (version bêta v5), `@mui/*`, `react`/`react-dom` (alignés avec `@types/react*`), `zod` et `@t3-oss/env-nextjs` (dépendent l'un de l'autre), `eslint` et son écosystème.
3. **Vérifier** après chaque lot :

   ```sh
   npm run check && npm run format:check && npm run test:server && npm run test:shared && npm run test:components && npm run build
   ```

   puis une passe manuelle en local (connexion, une enquête, un webhook de test).
4. Committer ensemble `package.json` **et** `package-lock.json`.

### Mise à jour de Node

La version de Node est déclarée à plusieurs endroits à garder alignés : `.nvmrc`, `engines.node` dans `package.json` et `package-lock.json`, et l'image `node:` du [docker-compose.yml](../docker-compose.yml). La CI ([app-near-ci.yml](../.github/workflows/app-near-ci.yml)) lit directement `.nvmrc`. Mettre à jour ces fichiers au même moment et vérifier la version configurée sur Scalingo (lue depuis `engines` au prochain déploiement).

### Mise à jour de PostgreSQL

La version est indiquée dans `docker-compose.yml` (image `postgres`) et dans la CI. La version de production est celle de l'addon Scalingo (montée de version gérée dans la console Scalingo, avec sauvegarde préalable). Garder l'environnement local et la CI proches de la production.

## Conventions et abréviations

Quelques préfixes/abréviations utilisés dans le code (composants, variables, routes) et pas forcément explicites :

- **Dv** (ex. `DvSuTitle`, `DvCarbonStackedBars`) : "Dataviz" — composants de visualisation de données dans `src/app/_components/dataviz/dataviz`, affichés via les "boards" du dossier `src/app/_components/dataviz/boards`.
- **SU** (ex. `su`, `useSuBank`, `getSuInfo`) : "Sphère d'Usage".
- **NGC** (ex. `/api/ngcform`, `carbon-footprint`) : "Nos Gestes Climat", le calculateur d'empreinte carbone, intégré dans l'application near-survey.
- **EMDV** (ex. `EmdvByCategoryBoards`, `EmdvPieChartsBoards`) : "Espace et Mode de Vie".
- **CSP** (ex. `DvCsp.tsx`) : "Catégorie Socio-Professionnelle".

Si vous introduisez une nouvelle abréviation dans le code, merci de l'ajouter à cette liste.
