# Near

Near est une plateforme qui accompagne des **enquêtes citoyennes par quartier** pour identifier les **Sphères d'Usage (SU)** des habitants : des groupes d'habitants qui ont des modes de vie et des empreintes carbone proches. Un pilote d'enquête crée un quartier, diffuse des questionnaires, suit la représentativité des réponses, déclenche le calcul des SU, puis exploite les résultats (tableaux de bord, export, empreinte carbone).

## Sommaire

- [Structure du repo](#structure-du-repo)
- [Architecture](#architecture)
- [Où est le code qui fait quoi](#où-est-le-code-qui-fait-quoi)
- [Environnements et hébergement](#environnements-et-hébergement)
- [Accès nécessaires à la reprise du projet](#accès-nécessaires-à-la-reprise-du-projet)
- [Installation et lancement avec Docker Compose](#installation-et-lancement-avec-docker-compose)
- [Autres modes de lancement](#autres-modes-de-lancement)
- [CI / CD](#ci--cd)
- [Documentation détaillée](#documentation-détaillée)

## Structure du repo

```text
near/
├── app-near/            Application web Next.js / T3 Stack (front, back, webhooks, scripts)
│   ├── src/             Code de l'application (app router, tRPC, services serveur)
│   ├── prisma/          Schéma de base de données et migrations
│   ├── scripts/         Scripts CLI : utilisateurs, enquêtes, INSEE, seeds, rejeu de webhooks...
│   └── README.md        Documentation détaillée de l'application
├── api-su/              API Python / Flask de calcul des sphères d'usage
│   └── README.md        Documentation détaillée de l'API
├── docs/                Documentation fonctionnelle (FAQ appel d'offre, diagramme de classes)
├── .github/workflows/   CI (tests app et api) et workflow de mise en production
├── docker-compose.yml   Environnement local complet (base + app-near + api-su)
└── CLAUDE.md            Instructions pour Claude Code (assistant de développement)
```

## Architecture

```text
 Habitants / enquêteurs                        Pilotes / administrateurs
          │                                               │
          ▼                                               ▼
 ┌─────────────────┐   webhook (HTTPS, signé HMAC)  ┌───────────────────────────┐
 │ Typeform (cloud)│ ─────────────────────────────▶ │  app-near (Next.js)       │
 │ formulaires SU  │       POST /api/typeform       │  front + tRPC + webhooks  │
 │ et mode de vie  │                                │                           │
 └─────────────────┘                                │                           │
 ┌─────────────────┐   webhooks (HTTPS, signés HMAC)│                           │
 │ near-survey     │ ────────────────────────────▶ │                           │
 │ (empreinte      │   POST /api/ngcform            └───┬───────────┬───────┬───┘
 │  carbone, NGC)  │   POST /api/ngcform/emails         │           │       │ e-mails
                                                         │ Prisma    │ HTTP  ▼
                                                         ▼           ▼     Brevo
                                              ┌──────────────┐  ┌──────────────┐
                                              │ PostgreSQL   │  │ api-su       │
                                              │ (Scalingo)   │  │ (Flask)      │
                                              └──────┬───────┘  └──────────────┘
                                                     │ lecture SQL
                                                     ▼
                                              ┌──────────────┐   iframes signées (JWT)
                                              │ Metabase     │ ──────────────────────▶ app-near
                                              │ (Scalingo)   │
                                              └──────────────┘
```

| Brique | Rôle | Techno | Hébergement |
| --- | --- | --- | --- |
| **Typeform** | Collecte des réponses aux questionnaires (sphères d'usage, mode de vie). Envoie chaque réponse à app-near par webhook. | SaaS Typeform | Cloud Typeform (hors repo) |
| **near-survey** | Application distincte (repo séparé) qui porte le questionnaire d'empreinte carbone basé sur Nos Gestes Climat (NGC). Elle envoie le résultat à `POST /api/ngcform` et l'e-mail laissé par l'habitant à `POST /api/ngcform/emails`, signés avec `NGC_SECRET`. | Voir son propre dépôt | Scalingo (application `near-survey`) |
| **app-near** | Interface (pilotes, administrateurs), API tRPC, réception des webhooks, scripts d'exploitation. | Next.js 15, tRPC, Prisma, NextAuth, MUI + Tailwind | Scalingo |
| **api-su** | Calcul (clustering) des sphères d'usage à partir des réponses. N'est appelée que par app-near, protégée par une clé partagée `API_SU_KEY`. | Python 3.13, Flask, NumPy, Gunicorn | Scalingo |
| **Base de données** | Enquêtes, réponses, SU, utilisateurs, erreurs de webhook (`raw_answer_error`), données INSEE. | PostgreSQL | Scalingo (addon) |
| **Metabase** | Tableaux de bord statistiques, affichés dans app-near par iframes signées (`METABASE_SECRET_KEY`). | Metabase | Scalingo |
| **Brevo** | Envoi d'e-mails transactionnels (`EMAIL_SERVICE=brevo`). | SaaS | Cloud Brevo |

### Flux principaux (ordre chronologique)

Une enquête se déroule sur un quartier, en cinq étapes :

1. **Collecte des sphères d'usage** : un Typeform pose des questions à un échantillon d'habitants du quartier (le lien contient les champs cachés `neighborhood`, `broadcast_channel`, `broadcast_id`). À chaque soumission, Typeform appelle `POST /api/typeform`. app-near vérifie la signature, convertit la réponse, la valide (Zod) puis l'enregistre (`su_answer`). En cas d'échec, le payload brut est conservé dans `raw_answer_error` et peut être rejoué. Détail : [Typeform et code](app-near/README.md#typeform-et-code).
2. **Calcul des sphères d'usage** : quand le pilote passe à la phase « Découverte et personnalisation » (phase 3), le calcul est lancé. app-near envoie les réponses à `api-su` (`POST /api-su/compute`), qui détermine les sphères et leurs barycentres. app-near les stocke, rattache chaque réponse à sa sphère et associe un nom et une couleur à partir de la « banque de SU » (`npm run su-bank:init`).
   **Validation des sphères d'usage et passage à la phase 4** : une fois les SU calculées et le formulaire de configuration du quartier (étape 1) complété, le pilote clique sur « Continuer l'enquête ». Cela envoie un e-mail (Brevo) à chaque répondant ayant laissé son adresse, lui indiquant sa sphère d'usage et lui donnant les liens vers le questionnaire de mode de vie et vers celui d'empreinte carbone ([sendUsersSu.ts](app-near/src/server/su/sendUsersSu.ts)), puis fait passer l'enquête en phase 4. **À partir de là, les sphères d'usage ne sont plus modifiables** : le calcul (`computeSu`) et l'envoi des e-mails exigent la phase 3, et les boutons correspondants sont désactivés dans l'interface. Les e-mails sont envoyés une seule fois, à ce moment précis.
3. **Collecte des modes de vie par SU** : un second Typeform (mode de vie) est diffusé. Chaque réponse est reçue par le même webhook `POST /api/typeform`, rattachée à une sphère d'usage (via `POST /api-su/assign`) et enregistrée dans `way_of_life_answer`. Un e-mail renvoie ensuite l'habitant vers l'étape suivante.
4. **Collecte des empreintes carbone par SU** : l'application **near-survey** porte le questionnaire d'empreinte carbone (basé sur Nos Gestes Climat) et envoie le résultat à `POST /api/ngcform`, qui le rattache lui aussi à une sphère d'usage (`carbon_footprint_answer`). Détail : [near-survey et NGC](app-near/README.md#near-survey-et-ngc).
5. **Production de datavisualisations** : tableaux de bord natifs dans app-near (composants `Dv*`) et dashboards Metabase embarqués, croisant les sphères d'usage, les modes de vie et les empreintes carbone.

### Phases d'une enquête

Ces étapes correspondent aux phases de l'enquête (`SurveyPhase`, que le pilote fait avancer dans l'interface) :

| Phase | Contenu | Flux correspondant |
| --- | --- | --- |
| `STEP_1_NEIGHBORHOOD_INFORMATION` | « Informations sur le quartier » : statistiques INSEE du quartier | Préparation, le webhook SU est déjà accepté |
| `STEP_2_SU_SURVERY` | « Enquête sur les Sphères d'Usages » : questionnaire et suivi de la représentativité | 1. Collecte des SU |
| `STEP_3_SU_EXPLORATION` | « Découverte et personnalisation » : calcul, exploration et validation des sphères d'usage (seule phase où on peut les recalculer) | 2. Calcul des SU |
| `STEP_4_ADDITIONAL_SURVEY` | « Enquêtes complémentaires » : questionnaires par SU ; les SU sont figées et les e-mails aux répondants ont été envoyés | 3. Modes de vie et 4. Empreintes carbone |
| `STEP_5_RESULTS` | « Résultats finaux et analyses » | 5. Datavisualisations |

Le webhook SU n'accepte les réponses que dans les phases 1 et 2 (voir `validSuPhases` dans `app-near/src/server/typeform/handleTypeformAnswer.ts`). Une réponse reçue hors phase est ignorée (code 200) et seulement tracée dans les logs : voir la procédure de récupération dans le [README d'app-near](app-near/README.md#récupérer-des-soumissions-su-perdues-à-cause-de-la-phase).

## Où est le code qui fait quoi

| Besoin | Où regarder |
| --- | --- |
| Réception des webhooks Typeform | `app-near/src/app/api/typeform/route.ts` → `src/server/typeform/` |
| Correspondance questions/réponses Typeform ↔ base | `app-near/src/server/surveys/references.ts`, `src/types/SuAnswer.ts`, `src/types/WayOfLifeAnswer.ts` |
| Schéma de base de données | `app-near/prisma/schema.prisma` |
| Appels vers api-su | `app-near/src/server/external-api/`, `app-near/src/server/su/computeSu.ts` |
| Algorithme et paramètres des SU | `api-su/app/clustering.py`, `api-su/app/constants.py` |
| Embarquement Metabase | `app-near/src/server/metabase/token.ts` |
| Scripts d'exploitation | `app-near/scripts/` |

## Environnements et hébergement

- **Production** : hébergée sur Scalingo (région `osc-fr1`) : app-near, api-su, PostgreSQL et Metabase. L'application de prod s'appelle `near-netzerocities` (`scalingo --region osc-fr1 --app near-netzerocities ...`).
- **Déploiement** : voir [CI / CD](#ci--cd). Le script `app-near/scripts/postdeploy.sh` est exécuté par Scalingo après chaque déploiement (migrations Prisma, initialisation de la banque de SU).
- **Variables d'environnement** : documentées dans `app-near/.env.example` et `api-su/.env.example`, validées au démarrage par `app-near/src/env.js`. Les valeurs de production sont dans la configuration des applications Scalingo.
- **Secrets partagés à garder synchronisés** : `API_SU_KEY` (app-near et api-su), `TYPEFORM_SECRET` (Typeform et app-near), `NGC_SECRET` (near-survey et app-near), `METABASE_SECRET_KEY` (Metabase et app-near).

## Accès nécessaires à la reprise du projet

Aucun secret n'est versionné. Pour reprendre l'exploitation, il faut avoir les accès suivants :

- le dépôt GitHub `ABC-TransitionBasCarbone/near` (droits d'écriture et déclenchement des workflows)
- un compte **Scalingo** avec accès aux applications app-near (`near-netzerocities`), `near-survey`, api-su, à l'addon PostgreSQL et à Metabase, et la CLI [Scalingo](https://doc.scalingo.com/cli)
- un accès au **compte Typeform** propriétaire des formulaires SU et mode de vie (webhooks, identifiants de formulaires)
- le dépôt et le déploiement de **near-survey** (non versionnés ici)
- l'administration de **Metabase** et le compte **Brevo** (e-mails)
- les valeurs des variables d'environnement de production (configurées dans Scalingo) : `TYPEFORM_SECRET`, `NGC_SECRET`, `API_SU_KEY`, `METABASE_SECRET_KEY`, `BREVO_API_KEY`, `AUTH_SECRET`...

## Installation et lancement avec Docker Compose

C'est la manière la plus simple d'obtenir un environnement complet (PostgreSQL, app-near, api-su) avec des données de démonstration.

### Prérequis

- Docker et Docker Compose v2 (`docker compose`)
- `curl` et `unzip`
- Les ports `3000` (app-near), `5000` (api-su) et `5432` (PostgreSQL) doivent être libres.

### Étapes manuelles (à faire une seule fois)

Ces étapes ne sont **pas** automatisées par `docker compose up`, et celui-ci échoue sans elles.

**1. Créer les fichiers d'environnement**

```sh
cp app-near/.env.example app-near/.env
cp api-su/.env.example api-su/.env
```

Créez-les **avant** le premier `docker compose up` : api-su ne relit son `.env` qu'au (re)démarrage (sinon `docker compose restart api-su`). Les valeurs par défaut conviennent en local. `API_SU_KEY` vaut `1234` dans les deux fichiers : si vous la changez, changez-la aux deux endroits. `DATABASE_URL` est écrasée par `docker-compose.yml` pour pointer vers le conteneur de base. Pour générer un vrai `AUTH_SECRET` : `openssl rand -base64 32`.

**2. Télécharger les données INSEE 2021** (fichier ignoré par git, ~55 Mo)

```sh
cd app-near/scripts/load-insee
curl -L -O https://www.insee.fr/fr/statistiques/fichier/8268806/base-ic-evol-struct-pop-2021_csv.zip
unzip base-ic-evol-struct-pop-2021_csv.zip
mv base-ic-evol-struct-pop-2021.CSV base-ic-evol-struct-pop-2021.csv
rm base-ic-evol-struct-pop-2021_csv.zip meta_base-ic-evol-struct-pop-2021.CSV
cd ../../..
```

Le nom attendu par `docker-compose.yml` est exactement `app-near/scripts/load-insee/base-ic-evol-struct-pop-2021.csv`.

### Lancement

```sh
docker compose up
```

Le premier démarrage est long (téléchargement des images, `npm install`, installation de pipenv). Au démarrage, le conteneur `app-near-web` enchaîne :

1. `npm i` puis `npm run db:migrate` (migrations Prisma)
2. `npm run data:reset` : **vide** les tables `insee_iris_2021`, `surveys` et `user` (avec `CASCADE`) de la base locale
3. `npm run load:insee` : charge les données INSEE
4. `npm run survey:create` : crée l'enquête de démonstration « Porte d'Orléans »
5. `npm run user:create` : crée deux utilisateurs
6. `npm run su-bank:init` : initialise la banque de noms/couleurs de SU
7. `npm run dev`

> **Attention** : les étapes 2 à 5 sont rejouées **à chaque** `docker compose up`, donc la base locale est remise à zéro à chaque démarrage. Pour conserver vos données locales (par exemple après avoir restauré une sauvegarde), utilisez la variante commentée dans `docker-compose.yml` (« uncomment when you need to localy start a backup »).

### Accès

| Service | URL |
| --- | --- |
| Application | <http://localhost:3000> (redirige vers `/connexion`) |
| api-su | <http://localhost:5000> (appelée avec l'en-tête de clé, voir [api-su/README.md](api-su/README.md)) |
| PostgreSQL | `postgresql://postgres:password@localhost:5432/app-near` |

Comptes de démonstration créés par le compose :

| Rôle | E-mail | Mot de passe |
| --- | --- | --- |
| ADMIN | `admin@mail.com` | `admin` |
| PILOTE (quartier « Porte d'Orléans ») | `pilote@mail.com` | `pilote` |

### Arrêt et remise à zéro

```sh
docker compose down        # arrête les conteneurs, conserve la base
docker compose down -v     # supprime aussi le volume PostgreSQL
```

> `docker-compose.yml` monte `./app-near` dans le conteneur et y exécute `npm i` : les dépendances installées dans `app-near/node_modules` le sont avec les binaires du conteneur (Alpine). Si vous développez aussi hors Docker sur le même dossier, relancez un `npm ci` sur votre machine après usage du compose.

### Tester le webhook Typeform en local

Une fois l'application lancée, vous pouvez simuler l'envoi d'une réponse Typeform signée :

```sh
cd app-near
./scripts/webhooks/query.sh localhost:3000/api/typeform typeform-secret ./scripts/webhooks/su.json
```

Voir [app-near/README.md](app-near/README.md#comment-tester-les-webhooks).

## Autres modes de lancement

- **Développement sur app-near** (base dans Docker, application en local) : [app-near/README.md](app-near/README.md#comment-installer-le-dépot-localement-)
- **Développement sur api-su** (pyenv + pipenv) : [api-su/README.md](api-su/README.md#lancement-en-local-usage-avancé)

## CI / CD

Workflows dans [.github/workflows/](.github/workflows/) :

| Workflow | Déclencheur | Rôle |
| --- | --- | --- |
| `app-near-ci.yml` | Pull request vers `develop` ou `main` touchant `app-near/**` | Installation, migrations, lint/typecheck et tests d'app-near |
| `api-su.yml` | Pull request vers `develop` ou `main` touchant `api-su/**` | Tests de l'API Flask |
| `app-near-cd.yml` | Déclenchement manuel (`workflow_dispatch`) | Fusionne `develop` dans `main` ; la mise en production se fait à partir de `main` |

La branche d'intégration est `develop`, la branche de production est `main`.

## Documentation détaillée

- [app-near/README.md](app-near/README.md) : installation, scripts, Typeform et modification des questionnaires, rejeu des erreurs, maintenance des dépendances
- [api-su/README.md](api-su/README.md) : lancement, déploiement, clé API, paramètres de l'algorithme, maintenance des dépendances
- [app-near/CLAUDE.md](app-near/CLAUDE.md) : conventions de code (utile aussi aux développeurs)
- [app-near/scripts/load-insee/README.md](app-near/scripts/load-insee/README.md) : données INSEE
- [docs/](docs/) : documentation fonctionnelle
