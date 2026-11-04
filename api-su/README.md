# API SU

API Python / Flask qui calcule les **sphères d'usage (SU)** d'une enquête : un clustering des réponses au questionnaire SU, puis l'attribution d'une réponse à une sphère existante. Elle n'est appelée que par [app-near](../app-near/README.md) ; vue d'ensemble dans le [README racine](../README.md).

## Endpoints

Toutes les requêtes doivent porter l'en-tête `X-API-KEY` égal à `API_SU_KEY` (sinon `401`). Les corps sont validés avec marshmallow (`400` si invalide).

| Méthode | Route | Rôle |
| --- | --- | --- |
| `POST` | `/api-su/compute` | Reçoit la liste des réponses (`id` + 6 variables numériques) et renvoie les SU calculées avec leurs barycentres |
| `POST` | `/api-su/assign` | Reçoit les SU existantes (`su` + barycentre à 6 valeurs) et une réponse, renvoie la SU la plus proche |

Les 6 variables (fréquence de viande, mode de transport, intensité du numérique, stratégie d'achat, voyages en avion, source de chauffage) sont converties en 1/2/3 côté app-near ([convert.ts](../app-near/src/server/external-api/convert.ts)). Le code est dans [app/__init__.py](app/__init__.py) (routes) et [app/clustering.py](app/clustering.py) (algorithme).

## Variables d'environnement

Voir [.env.example](.env.example) : `FLASK_APP`, `NEAR_APP_URL` (origine autorisée par CORS, l'URL d'app-near) et `API_SU_KEY` (clé partagée avec app-near). Le fichier `.env` doit exister **avant** le démarrage du serveur (sans `NEAR_APP_URL`, toutes les requêtes échouent en erreur 500 à cause de CORS).

## Lancement dans container docker (recommandé)

Si vous n'avez pas besoin de développer sur l'API et souhaitez simplement la lancer, à partir de la racine de ce repository :

```sh
docker compose up -d
```

Cela lance en local, l'app near, l'api su et une base de données.

## Lancement en local (usage avancé)

* Installer [pyenv](https://github.com/pyenv/pyenv?tab=readme-ov-file#installation)
Cela permet de gérer plusieurs versions de Python et utilise la version dans `.python-version` sur le projet.
* Install [pipenv](https://pipenv.pypa.io/en/latest/installation.html)
Cela permet de gérer l'environnement virtuel et les dépendances de manière plus simple et sécurisé.
* Installer les dépendances avec pipenv : `pipenv install --dev`

Si vous n'avez pas la bonne version de Python installé, pipenv devrait vous proposer de l'installer avec pyenv.
Sinon, installer python 3.13 : `pyenv install 3.13`.
Penser à configurer l'interpréteur python de votre IDE.

* Définir les variables d'environnement : `cp .env.example .env`
* Installer le precommit hook : `pipenv run pre-commit install`

* Lancer l'application : `pipenv run flask run`
* Lancer en mode debug : ajouter `--debug`
* Lancer les tests : `pipenv run test`
* Lancer le lint du code : `pipenv run lint`
* Formatter le code : `pipenv run format`

Pour ne pas avoir à spécifier `pipenv run` devant chaque commande, vous pouvez charger l'environnement virtuel avec `pipenv shell`

## Déploiement en production

Pour [déployer en production](https://flask.palletsprojects.com/en/stable/deploying/), on utilise [Gunicorn](https://flask.palletsprojects.com/en/stable/deploying/gunicorn/).

La commande de lancement se trouve dans le fichier `Procfile`.

## Génération d'une clé API

Cette API ne doit être appelé que par l'app Near. Elle est donc sécurisée par une clé (`API_SU_KEY`) partagée par les 2 applications.

Pour générer une clé, vous pouvez utiliser la commande suivante : `python -c 'import secrets; print(secrets.token_hex())'`

## Modification des paramètres de l'algorithme des SU

Les paramètres de l'algorithme des SU se trouvent dans le fichier [constants.py](app/constants.py).

Editer le fichier via github et renseigner un commit message adapté.

## Tests

`pipenv run test` (pytest, dossier `tests/`). Ils tournent en CI sur chaque pull request touchant `api-su/` ([api-su.yml](../.github/workflows/api-su.yml)) avec `.env.ci` copié en `.env`.

## Maintenance des dépendances

Les dépendances sont déclarées dans le `Pipfile` (plages `~=`) et figées dans `Pipfile.lock`, le seul fichier que le déploiement et le Docker Compose consultent (`pipenv install --deploy --ignore-pipfile`). Travailler sur une branche dédiée et toujours committer ensemble `Pipfile` et `Pipfile.lock`.

### Analyse de sécurité

```sh
pipx install pip-audit              # une seule fois
pipenv requirements > /tmp/requirements.txt
pip-audit -r /tmp/requirements.txt  # CVE connues dans les dépendances de production
pipenv requirements --dev > /tmp/requirements-dev.txt && pip-audit -r /tmp/requirements-dev.txt
```

`pipenv requirements` exporte le contenu de `Pipfile.lock`. Traiter d'abord les alertes sur les dépendances de production (flask, gunicorn, numpy, marshmallow, flask-cors). Sans correctif disponible, documenter la décision dans la pull request. GitHub peut aussi remonter ces alertes si Dependabot est activé sur le dépôt (Settings → Code security).

### Mise à jour des dépendances

```sh
pipenv update --outdated   # liste ce qui peut être mis à jour
pipenv update flask        # met à jour un paquet (et son verrouillage)
pipenv update              # met à jour tout dans les plages du Pipfile
```

1. Les plages `~=` du `Pipfile` bloquent les montées mineures/majeures : pour monter `flask` de 3.1 à 3.2 par exemple, modifier la plage dans le `Pipfile`, puis `pipenv lock` (ou `pipenv update flask`).
2. `numpy` et `pandas` (dev, utilisé par les tests) : monter avec prudence, le résultat du clustering doit rester identique ; les tests de `tests/` servent de garde-fou.
3. Vérifier après chaque lot : `pipenv run test`, `pipenv run lint`, `pipenv run format`, puis lancer l'API (`pipenv run flask run`) et appeler `/api-su/compute` depuis app-near en local.
4. Le hook pre-commit utilise une version figée de ruff (`.pre-commit-config.yaml`) : `pipenv run pre-commit autoupdate` la met à jour.

### Mise à jour de Python

La version est déclarée à plusieurs endroits, à garder alignés : `.python-version`, `[requires]` du `Pipfile`, l'image `python:` du [docker-compose.yml](../docker-compose.yml), la CI ([api-su.yml](../.github/workflows/api-su.yml)) et la version configurée sur Scalingo. Après changement, régénérer `Pipfile.lock` (`pipenv lock`).
