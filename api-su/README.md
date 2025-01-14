# API SU

## Installation

* Installer [pyenv](https://github.com/pyenv/pyenv?tab=readme-ov-file#installation)
Cela permet de gérer plusieurs versions de Python et utilise la version dans `.python-version` sur le projet.
* Install [pipenv](https://pipenv.pypa.io/en/latest/installation.html)
Cela permet de gérer l'environnement virtuel et les dépendances de manière plus simple et sécurisé.
* Installer les dépendances avec pipenv : `pipenv install --dev`
Si vous n'avez pas la bonne version de Python installé, pipenv devrait vous proposer de l'installer avec pyenv. 
Sinon, installer python 3.13 : `pyenv install 3.13`.
Penser à configurer l'interpréteur python de votre IDE.
* Définir les variables d'environnement : `cp .env.example .env`
* Charger l'environnement virtuel : `pipenv shell`
* Installer le precommit hook : `pre-commit install`

## Lancement en local

* S'assurer que l'environnement virtuel est chargé ou exécuter `pipenv shell`
* Lancer l'application : `flask run`
* Lancer en mode debug : ajouter `--debug`

## Déploiement en production

Pour [déployer en production](https://flask.palletsprojects.com/en/stable/deploying/), on utilise [Gunicorn](https://flask.palletsprojects.com/en/stable/deploying/gunicorn/).
La commande de lancement se trouve dans le fichier `Procfile`.



