# F.A.Q appel d'offre projet NEAR

F.A.Q listant l'ensemble des Q & R reçues dans le cadre de la réponse au cahier des charges du projet NEAR.
Pour l'architecture informatique nous voudrions que l'offre essaie de s'approcher de notre projet actuel (NextJS monlithique FRONT/BACK + Prisma + PostgreSQL) : https://github.com/ABC-TransitionBasCarbone/bilan-carbone (demandez moi si vous souhaitez y accéder)

### Q0  `Réponse à l'appel d'offre` : Doit-on fournir une proposition commercial pour la V1 et la V2 ? Est-on bien sur une offre forfaitaire ?

**R0** : On veut une offre forfaitaire (engagement de résultat) pour la V1. La V2 fera l'objet d'un second cahier des charges car toutes les fonctionnalités ne sont pas encore connues. Toutefois, des éléments de préfiguration de cette V2 sont présents dans ce cdc afin que les développements de la V1 soient pensés et réalisés de manière à ne pas bloquer ces fonctionnalités déjà attendues en V2.

### Q1 `Planning` : La deadline de mars est-elle un jalon incontournable ou un décalage temporel est-il envisageable ?

**R1** : La contrainte de mars est incontournable. Cependant, on peut envisager un début d'expérimentation fin mars (plutôt que début mars afin de gagner plusieurs semaines) et migrer certaines fonctionnalités vers la V2 (le suivi de diffusion par exemple) pour avoir un MVP prêt pour conduire une enquête pour la V1. Cette V1 doit à minima permettre d'initier un premier quartier, de recueillir des questionnaires dans une base de donnée structurée et d'identifier les Sphères d'Usages (SU). On peut aussi faire une sélection dans les visualisations de données et en migrer certaines vers la V2.

### Q2 `Backoffice` : Quelles fonctionnalités de backoffice sont attendues en V1 ? (A RELIRE PAR ROMAIN✅ + RQT✅)

**R2** : Nous souhaitons à minima :
- une gestion des types et accès des utilisateurs ;
- un dépot pour mettre en ligne et ajourner la liste des noms de Sphères d'Usages et pallettes de couleurs affhérentes (un dépot manuel sur le depository peut faire l'affaire) ;
- la possibilité d'ajouter ou corriger les différentes versions des scripts Python pour (1) la détection et (2) l'identification des Sphères d'Usages.
- le téléchargement et/ou l'accès à la BDD complète à fin d'analyses, y compris en dehors de la plateforme.

La gestion des types d'utilisateurs évoluent entre la V1 et la V2 :
- V1 Mot de passe crypté avec gestion de mdp oublié
- V2 Gestion des droits avec plusieurs types d'utilisateurs (administrateur national, enquêteur de quartier, enquêté)

### Q3: `Hébergement` : Quels coûts d'hébergement "actuels" et futurs doivent-être pris en compte ?

**R3** : Il est proposé aux prestataires d'inclure dans leurs réponses commerciales la prise en charge des coûts d'hébergement pendant la conception du projet (2 ans) et d'y ajouter une option relative aux coûts d'hébergement futur (à l'issu du projet) chiffrés en eur/an. Le prestataire devra nous proposer une ou plusieurs solution d'hébrgement (avec les coûts associés). Actuellement nous hébergeons nos applications sous Vercel mais nous sommes ouvert à d'autres hébergement. Il nous faudra un accès d'administration à l'outil d'hébergement et la pleine propriété de celui ci.

### Q4 `Conception modulaire` : La modularité souhaitée (conception et fort découplage des différents modules) doit-elle se retrouver uniquement dans le code produit ou cela doit-il aller jusqu’à un développement de micro-applications front indépendantes ?

**R4** : Nous pouvons nous orienter vers une architecture monolithique par composant mais sans micro-fronts indépendants. Idéalement en se basant sur l'architecture de notre nouvel outil de bilan carbone open source et NGC pour la partie empreinte.
(QeT) *Du point de vue des usagers et des communautés qui pourraient enrichir la plateforme dans le futur, il s'agit avant tout de laisser le champ ouvert pour la mise à disposition de modules ou sous-modules alternatifs pour les différentes étapes. En V5 / V6 (à terme, d'ici quelques années), la possibilité pourrait être offerte aux usagers de sélectionner le type de module qu'ils souhaitent pour une étape donnée (ex: différents diagnostics suivant la typologie de quartier, possibilité d'activer ou non certaines visualisations de données, modules d'analyse complémentaire, ...). D'une certaine façon, l'ambition à long terme est de penser la possibilité d'ajouter des "plug-ins communautaires" pour tout ou partie des étapes sans avoir à mettre fondamentalement à niveau la structure monolithique de base.*

### Q5 `Module #0 – Page d’accueil` : Le cdc inclue en V1 la construction de quartier en sélectionnant un ou plusieurs IRIS. Toutefois, le cdc stipule aussi que la V1 aura pour but l'expérimentation sur un seul quartier, pré-paramétré. Quid de la fonctionnalité de sélection et de création d'enquête sur un quartier en V1 ? Que doit pouvoir faire l'utilisateur une fois un quartier créé ?

**R5** : La fonctionnalité de sélection d'IRIS (par un utilisateur externe, sur une carte notamment) peut être transférée en V2. En V1 nous serons les seuls utilisateurs de la plateforme et nous connaitrons l'IRIS du quartier séléctionné.

### Q6 `Module #1 - Connexion` : Quels accès doivent être créés en V1 car le cas de partage d'identifiants entre plusieurs utilisateurs semble exister ? (A RELIRE PAR ROMAIN✅ + RQT✅)

**R6** : Nous souhaitons un identifiant de connexion propre à chaque utilisateur. En V1, seules les équipes RQT/ABC auront besoin d'identifiants.

**A valider entre nous la proposition de Lukla sur les différents compte**. Ne serait-il pas plus pertinent de créer des accès nominatifs, rattachés à un même compte au sens fonctionnel ? On pourrait distinguer la notion de compte applicatif, et la notion de compte d'accès (1 compte applicatif dispose de n comptes d'accès). Qu’en pensez-vous ?
==> C'est une très bonne idée, plusieurs comptes peuvent avoir la qualité de "pilote", avec exactement les mêmes droits.

ABC : Je pense qu'il est en effet intéressant d'avoir un compte nominatif (unique pour l'utilisateur) qui a un accès sur un ou plusieurs quartiers/enquêtes.
RC : Les accès nominatifs sont en effet la meilleur solution en matière de sécurité. Nous exigeons que l'outil respecte les normes RGPD réglementaire mais la criticité de l'application ne nécessite pas plus de sécurité que celle ci.

### Q7 : `Module #1 : Connexion` : Qu'est-il attendu au sujet du stockage en statique sur l'ordinateur ?

_Il est indiqué dans le cdc que "dans la mesure du possible, le fait de quitter le portail ne doit pas permettre le stock automatique de la liste adresses mails des participants (ou autres données sensibles) en statique sur l’ordinateur"

**R7** : Nous aimerions éviter (si techniquement possible) que les adresses mails des répondants aux enquêtes soient stockées sur le cache du naviguateur utilisé.
QeT : *Dans les faits, nous nous en remetons à votre expertise pour juger du caractère trop précotioneux ou non de cette feature*.

### Q8 : `Module #5 : Détection des sphères d’usages` : Pouvez-vous clarifier les modifications possibles par le pilote sur l'algo de détection des SU ?

_Il est indiqué qu'il peut être modifié « deux variables d’entrée » de l’algorithme sans pour autant retrouver de zone de saisie correspondante dans le Miro.

**R8** : Le pilote peut modifier le nombre visé de S.U., la part minimum (i) et le nombre d'itération. Ce sont des zones de saisie et il manque effectivement un menu-déroulant (dans le Miro) pour sélectionner un nombre d'itération. **Une solution plus simple que nous pouvons mettre en place est d'avoir une liste de scripts .py qui ont déjà des ensembles de paramètres stockés, et d'excécuter l'un d'eux suivant la sélection de l'utilisateur.**

### Q9 : `Module #5 : détection des sphères d’usages` : L'appartenance d'une personne à une SU identifiée par l'algorithme passe forcément par l'appel au second algorithme ?

**R9** : Oui, il est nécessaire de passer par l'algorithme n°2 pour connaître une Sphère d'Usages. Les Sphères d'Usages permettent notamment de catégoriser les données, toute réponse doit être catégorisée et filtrable selon sa S.U. Le script S.U. n°1 va déterminer la partition de Sphères d'Usages dans le quartier, le script S.U. n°2 va catégoriser chaque réponse à une enquête par Sphère d'Usages parmi la liste identifiée dans le quartier.

### Q10 : `Module #5 : détection des Sphères d’Usages` : quel interfaçage avec l'algo Python est à prévoir ?

**R10** : Les scripts Python sont fournis. Ce sont des scripts à éxécuter. Il n'y a pas d'API à prévoir.

### Q11 : `Module #6 : découvrir et personnaliser les Sphères d’Usages` : Y-a-t'il un lien entre la nature de la SU et le nom qui doit lui être attribué ?

**R11** : Les noms n’ont pas de règles de définition propres aux spécificités des SU. Ce sont des noms prédéfinis attribués aléatoirement. L'utilisateur de niveau "pilote local" peut au choix sélectionner un combo nom+palette dans la liste ou en sélectionner un aléatoirement.

### Q12 : `Module #7 : Suivi d’enquête 2` : Existe-t-il un mécanisme de fin automatique quand un certain nombre de réponses a été obtenu pour chaque questionnaire (comme pour le suivi 1) ?

**R12** : Oui, il y a bien deux seuils différents, un pour l'enquête SU, et un second pour l'enquête MdV+EdV+NGC.

### Q13 : `Module #9 : Résultats d’enquêtes` : Le bouton « Comparer les résultats » de ce module est-il un lien vers le Module #10 ?

**R13** : Oui, il s'agit d'un lien vers le Module #10

### Q14 : `Module #13 : Enquête 1 : Sphère d’Usages` : Peut-on préciser les fonctionnalités des deux boutons "Voir le détail" et "Comparer" présents sur l'écran de remerciement car non documentés dans le cahier des charges ? 

**R14** : Les boutons "voir le détail" et "comparer" qu'on peut observer en fin d'enquête ne seront finalement pas disponibles en V1. En V2, l'utilisateur pourra comparer une partie de ses réponses avec des données nationales.

### Q15 : `Module #13 : Questionnaire carbone` : Quelle intégration de NGC doit-être prévue pour le questionnaire carbone ?

**R15** : L'ABC sera en charge de développer un questionnaire adapté et assurera le back publicodes du questionnaire. Ce back sera en V1 déployé sur un front spécifique. En v2, si possible il sera envisagé une intégration complète dans la plateforme NEAR.

### Q16 : `Design et maquettage` : Qu'est-il attendu en termes de travail de maquettage et design ?

**R16** : Etant donné que la V1 a avant tout pour objectif d'aboutir à une plateforme fonctionnelle pour conduire nous-même la première enquête, peu de choses sont attendus. Seule, une revue simple du layout général, des questionnaires destinés aux sondés (qui devront être réalisables sur smartphone) et des pages de restitution devront être fait. Pour la V2 un travail de maquettage sera réalisé en amont par RQT et un appui pourra être sollicité.

### Q17 : `Gestion d'envoi des mails` : Doit-on prévoir un outil de gestion d’envoi de mails ?

**R17** : Non nécessaire en V1 mais potentiellement à intégrer en V2.

### Q18 : `Open source et solutions propriétaire` : Etes-vous ouverts à l'utilisation de solutions propriétaire payantes ?

**R18** : Le code doit être sous licence libre (idéalement stocké sur GitHub comme nos autres projets). Si le logiciel permet une facile contribution des utilisateurs et une réutilisation de l'outil dans le futur nous n'excluons pas les solutions propriétaires payantes si elles permettent de réduire les coûts globaux du projet.

### Q19 : Les prestataires doivent-il prévoir une proposition commerciale un accompagnement pour la partie UX/UI ?

**R19** Nous sommes très enclins à un accompagnement pour la partie UX/UI. À savoir que (ce qui n’est pas forcément clair dans le cahier des charges) :
- La V1 vise en particulier pour nous à automatiser et expérimenter la visualisation de données et les fonctionnalités “coeur” (le modèle statistique, l’automatisation de nos algorithmes Python, …). Son UI peut être très “experte”, et être laissée pour amélioration plus tard. L’UX (ou l'enchaînement des modules et des fonctionnalités présentes) peut être susceptible d’évoluer en fonction des retours que nous aurons lors de la première enquête (bien que l'enchaînement général du portail pilote local semble aligné avec nos expérimentations précédentes).
- La V2 vise en particulier la création d’une version plus “grand public” avec une UI/UX plus accueillante. Nous avons un temps de 3 mois dédiés entre le 1er Décembre et le 28 Février pour le design UX/UI de la V2, avec notamment 2 designers ayant une fine connaissance des enjeux de la plateforme, et la possibilité de tester des maquettes avec les futurs utilisateurs.
⇒ Aussi, il paraît judicieux de faire un travail commun d’UX/UI, à la fois pour la V1 et V2, en organisant des temps de travail en amont de la période indiquée ci-dessus plus spécifiquement pour résoudre les questions de la V1, et en travaillant ensembles plus en détail pour la V2.

### Q20 : Pour la V1, quelles sont les attentes en termes de responsivité et de devices ?

**R20** : La V1 du portail local doit être responsive pour des tablettes et ordinateurs aux ratios 4:3, 16:9 et 21:9, mais pas sur mobile à ce stade (nous n’avons pas eu le temps à date de penser à l'expérience mobile en détail).
À l’exception de ces modules et boards qui doivent être accessibles sur Mobile en V1 : 
- #4 (suivi d’enquête Sphères d’Usages),
- #7 (suivi d’enquête MdV, EdV, CC)
- #8 (Diffusion, en particulier le module de création de lien, mais pas le sous-module “suivi de diffusion”, trop complexe sur mobile), qui pourraient être utiles sur mobile.
- Le portail enquête (les questionnaires vus par les citoyens) qui doivent être accessibles sur mobile, pc et tablette, y compris sur d'anciens appareils.

### Q21 : Concernant la phase 1 : Est-ce que les objectifs (nombre de personnes ayant répondu par âge, genre, CSP) à atteindre seront statiques ou définis par enquête ?

**R21** Ces objectifs sont statiques. Ils sont différents pour l’enquête #1 Sphères d’Usages (en l’état, 95% de taux de confiance, 5% de marge d’erreur) et l’enquête #2 MdV, EdV, CC (encore indéfinie, moins élevé). Les valeurs indiquées ici à titre d’exemple pourront changer dans les prochaines semaines. En V2, ces seuils statiques pourront être modifiés depuis le portail national pour l’ensemble des quartiers à venir (sans rétroaction sur les quartiers passés).
→ Dans les faits, la taille de l’échantillon évolue de façon logarithmique, sélectionner 1 ou 3 IRIS ne va pas significativement changer la taille de l’échantillon. *Si le calcul dynamique de l’échantillon pose une difficulté ou est trop chronophage, on peut aussi utiliser une “banque” de tailles d’échantillons déjà fixés* (en revanche les répartitions CSP, genre et âge doivent correspondre aux données des IRIS sélectionnés).

### Q22 : La base de données IRIS du découpage géographique par quartier évolue 1 fois par an. Est-ce que vous souhaitez que ce référentiel soit mis à jour tous les ans ?

**R22** : Oui, celle-ci doit être mise à jour une fois par an. Il semble difficile de trouver une bdd mise à jour régulièrement qui comprenne à la fois les données issues du recensement et le découpage géoformes des IRIS. Si la forme d'un quartier évolue avec le temps, l'utilisateur doit pouvoir comprendre si sa zone recouvre une ancienne zone géographique. En V1, il s'agit seulement de garder une trace des IRIS sélectionnées à date, mais pas de comparaison complexe à prévoir à court terme.
