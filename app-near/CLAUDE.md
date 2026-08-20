# app-near — règles pour Claude Code

Next.js 15 (App Router) / T3 Stack : tRPC, Prisma, NextAuth, MUI + Tailwind. Voir le [README.md](README.md) pour l'installation, les scripts et les conventions/abréviations du projet (Dv, SU, NGC, EMDV, CSP...).

## Avant de considérer une tâche terminée

Toujours lancer, et corriger les échecs avant de rendre la main :

```sh
npm run check        # next lint + tsc --noEmit
npm run format:check # prettier (si des fichiers ont été créés/modifiés significativement)
```

Puis lancer les tests concernés par le changement (voir section Tests). Ne pas lancer toute la suite de tests si seul un sous-dossier est concerné — cibler avec `--testPathPattern` ou en passant le fichier en argument.

## Langue : code vs interface

- **Code** (identifiants, types, noms de fichiers, commentaires, messages de log/erreur internes) : **en anglais**.
- **Interface utilisateur** (texte JSX affiché à l'écran, labels de formulaires, emails, contenu des `Board`/`Dv*`) : **en français**, comme l'existant (ex. `CarbonBoard.tsx`, `BoardTabs.tsx`). Ne jamais traduire ce texte en anglais.
- Si une nouvelle abréviation métier est introduite dans le code (à la manière de SU, NGC, EMDV, CSP...), l'ajouter à la section "Conventions et abréviations" du README.

## Commentaires

- Par défaut : **aucun commentaire**.
- N'en ajouter que pour expliciter un **pourquoi** non évident : une contrainte cachée, un contournement de bug, un invariant, une décision qui surprendrait un relecteur. Jamais pour décrire ce que le code fait déjà de façon lisible (le nommage doit suffire).
- Ne pas laisser de commentaires qui référencent la tâche en cours, un ticket, ou "code retiré" — ça se périme et ça n'a pas sa place dans le code (ça va dans le message de commit).
- Toujours en anglais, même si le reste du fichier contient du texte UI en français.

## Tests unitaires

Toute nouvelle logique non triviale (calculs, transformations, règles métier, hooks, endpoints tRPC) doit être accompagnée d'un test. Trois périmètres avec des configs Jest distinctes — regarder un fichier `.spec.ts` voisin existant pour le pattern avant d'en écrire un nouveau :

| Périmètre | Emplacement | Commande | Config |
|---|---|---|---|
| Server (tRPC routers, services, webhooks) | `src/server/**/*.spec.ts` | `npm run test:server` | `jest.server.config.mjs` |
| Shared (utils partagés) | `src/shared/**/*.spec.ts` | `npm run test:shared` | `jest.shared.config.mjs` |
| Composants React | `src/app/**/*.spec.(ts\|tsx)` | `npm run test:components` | `jest.components.config.mjs` |

Pour un fichier précis : `NODE_OPTIONS='--experimental-vm-modules' npx jest --config=jest.server.config.mjs --runInBand <chemin>` (adapter la config au périmètre).

Ne pas mocker la base de données dans les tests server si le test existant du même dossier ne le fait pas déjà — suivre le pattern en place plutôt que d'en introduire un nouveau isolément.

## Accessibilité (RGAA)

Tout composant UI nouveau ou modifié doit respecter les bases du RGAA :

- HTML sémantique en priorité (`button`, `nav`, `h1`-`h6` dans l'ordre, `label` lié à son champ) avant d'ajouter des rôles ARIA.
- Emojis/icônes purement décoratifs : `aria-hidden="true"` (déjà en place dans `BoardTabs.tsx`, à reproduire).
- Emojis/icônes porteurs de sens (seuls, sans texte à côté) : fournir un équivalent texte (`aria-label` ou texte visuellement masqué), pas seulement l'emoji.
- Tout élément interactif doit être atteignable et actionnable au clavier (pas de `onClick` sur un `div` sans rôle/tabindex/gestion clavier — utiliser `button`).
- Contraste suffisant (AA) pour le texte sur fond coloré ; s'appuyer sur les couleurs déjà définies dans `tailwind.config.ts` plutôt que d'introduire de nouvelles teintes ad hoc.
- Formulaires (`react-hook-form`) : erreurs de validation annoncées (`aria-invalid`, message associé au champ via `aria-describedby`), pas seulement une couleur.
- Composants MUI : ne pas désactiver leurs comportements d'accessibilité par défaut (focus visible, roles) sans raison documentée.

## Structure et factorisation

- Respecter l'arborescence existante de `src/app/_components` : `_ui` (composants génériques réutilisables), `_services` (logique non-UI), `_context`, et les dossiers fonctionnels (`dataviz`, `survey`, `back-office`...). Une nouvelle brique générique va dans `_ui`, pas dans un dossier métier.
- `dataviz` : les composants de visualisation vivent dans `dataviz/dataviz` (préfixe `Dv`), exposés à l'utilisateur via les `boards` de `dataviz/boards`. Respecter cette séparation données/présentation vs assemblage d'écran.
- Avant d'ajouter une fonction utilitaire, chercher si un équivalent existe déjà dans `src/shared` ou `src/server/utils` — éviter la duplication entre server et composants.
- Types partagés : `src/types`. Schémas de validation : `src/schemas` (Zod). Ne pas dupliquer un schéma Zod déjà défini pour la même forme de données.

## TypeScript / lint

- Pas de `any` explicite ni de `// eslint-disable` sans nécessité réelle documentée en commentaire (why, pas juste pour faire taire le lint).
- Suivre les règles déjà actives dans `.eslintrc.cjs` (imports de types via `import { type X }`, `prefer-template`, pas de promesses non gérées dans les handlers d'événements).
- Types Prisma générés (`@prisma/client`) : après une migration de schéma, `npm run db:generate` avant d'utiliser les nouveaux types.

## Divers

- Les scripts CLI (`scripts/`) suivent le pattern `<action> -- key=value` déjà en place (voir README) : respecter ce format plutôt que d'introduire des flags `--xxx` classiques.
- Toute nouvelle route API/webhook doit gérer explicitement les cas d'erreur et, si pertinent, alimenter `raw_answer_error` comme le font les webhooks existants (voir "Comment lister et rejouer les webhooks en erreur" dans le README) plutôt que d'échouer silencieusement.
