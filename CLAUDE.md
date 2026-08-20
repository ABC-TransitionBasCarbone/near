# Near — monorepo

## Structure

- [app-near](app-near/) : application web (Next.js / T3 Stack). Voir [app-near/CLAUDE.md](app-near/CLAUDE.md) pour les règles détaillées.
- [api-su](api-su/) : API de calcul des sphères d'usage (Python / Flask). Lint/format via `ruff` (`pipenv run lint`, `pipenv run format`), tests via `pipenv run test`.

La grande majorité du travail se fait dans `app-near` : préfère toujours vérifier s'il existe un `CLAUDE.md` plus spécifique dans le sous-dossier concerné avant d'agir.

## Règles communes aux deux applications

- **README à jour** : toute modification de commande, script, variable d'environnement ou procédure d'installation doit être répercutée dans le `README.md` du dossier concerné.
- **Docker Compose** (`docker-compose.yml`) orchestre les deux apps + la base : si un service, une variable ou un port change, vérifier la cohérence avec les `.env.example` des deux projets.
