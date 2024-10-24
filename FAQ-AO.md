# F.A.Q appel d'offre projet NEAR

F.A.Q listant l'ensemble des Q & R reçues dans le cadre de la réponse au cahier des charges du projet NEAR.

### Q0  `Réponse à l'appel d'offre` : Doit-on fournir une proposition commercial pour la V1 et la V2 ? Est-on bien sur une offre forfaitaire ?

**R0** : On veut une offre forfaitaire (engagement de résultat) pour la V1 ? La V2 fera l'objet d'un second cahier des charges car toutes les fonctionnalités ne sont pas encore connues. Toutefois, des éléments de préfiguration de cette V2 sont présents dans ce cdc afin que les développements de la V1 soient pensés et réalisés de manière à ne pas bloquer ces fonctionnalités déjà attendues en V2.

### Q1 `Planning` : La deadline de mars est-elle un jalon incontournable ou un décalage temporel est-il envisageable ?

**R1** : La contrainte de mars est incontournable. Cependant, on on peut envisager un début d'expérimentation fin mars (plutôt que début mars afin de gagner plusieurs semaines) et migrer certaines fonctionnalités vers la V2 (le suivi de diffusion par exemple) pour avoir un MVP prêt pour conduire une enquête pour la V1. Cette V1 doit à minima permettre d'initier un premier quartier, de recueillir des questionnaires dans une base de donnée structurée et d'identifier les Sphères d'Usages (SU). On peut aussi faire une sélection dans les visualisations de données et en migrer certaines vers la V2.

### Q2 `Backoffice` : Quelles fonctionnalités de backoffice sont attendues en V1 ? (A RELIRE PAR ROMAIN✅ + RQT✅)

**R2** : Nous souhaitons à minima :
- une gestion des types et accès des utilisateurs ;
- un dépot pour mettre en ligne et ajourner la liste des noms de Sphères d'Usages et pallettes de couleurs affhérentes (on peut être fait manuellement sur le depository) ;
- la possibilité d'ajouter ou corriger les différentes versions des scripts Python pour (1) la détection et (2) l'identification des Sphères d'Usages.

La gestion des types d'utilisateurs évoluent entre la V1 et la V2 :
- V1 Mot de passe crypté avec gestion de mdp oublié
- V2 Gestion des droits avec plusieurs types d'utilisateurs (administrateur national, enquêteur de quartier, enquêté)

### Q3: `Hébergement` : Quels coups d'hébergement "actuels" et futurs doivent-être pris en compte ?

**R3** : Il est proposé aux prestataires d'inclure dans leurs réponses commerciales la prise en charge des coups d'hébergement pendant la conception du projet (2 ans) et d'y ajouter une option relative aux coûts d'hébergement futur (à l'issu du projet) chiffrés en eur/an. Le prestataire devra nous proposer une ou plusieurs solution d'hébrgement (avec les coûts associés). Actuellement nous hébergeons nos applications sous Vercel mais nous sommes ouvert à d'autres hébergement. Il nous faudra un accès d'administration à l'outil d'hébergement et la pleine propriété de celui ci.

### Q4 `Conception modulaire` : La modularité souhaitée (conception et fort découplage des différents modules) doit-elle se retrouver uniquement dans le code produit ou cela doit-il aller jusqu’à un développement de micro-applications front indépendantes ?

**R4** : Nous pouvons nous orienter vers une architecture monolithique par composant mais sans micro-fronts indépendants. Idéalement en se basant sur l'architecture de notre nouvel outil de bilan carbone open source et NGC pour la partie empreinte.

### Q5 `Module #0 – Page d’accueil` : Le cdc inclue en V1  la construction de quartier en sélectionnant un ou plusieurs IRIS. Toutefois, le cdc stipule aussi que la V1 aura pour but l'expérimentation sur un seul quartier, pré-paramétré. Quid de la fonctionnalité de sélection et de création d'enquête sur un quartier en V1 ? Que doit pouvoir faire l'utilisateur une fois un quartier créé ?

**R5** : La fonctionnalité de sélection d'IRIS (par un utilisateur externe, sur une carte notamment) peut être transféré en V2. En V1 nous serons les seuls utilisateurs de la plateforme et nous connaitrons l'IRIS du quartier séléctionné.

### Q6 `Module #1 - Connexion` : Quels accès doivent être créés en V1 car le cas de partage d'identifiants entre plusieurs utilisateurs semble exister ? (A RELIRE PAR ROMAIN✅ + RQT✅)

**R6** : Nous souhaitons un identifiant de connexion propre à chaque utilisateur. En V1, seules les équipes RQT/ABC auront besoin d'identifiants.

**A valider entre nous la proposition de Lukla sur les différents compte**. Ne serait-il pas plus pertinent de créer des accès nominatifs, rattachés à un même compte au sens fonctionnel ? On pourrait distinguer la notion de compte applicatif, et la notion de compte d'accès (1 compte applicatif dispose de n comptes d'accès). Qu’en pensez-vous ?
==> C'est une très bonne idée, plusieurs comptes peuvent avoir la qualité de "pilote", avec exactement les mêmes droits.

ABC : Je pense qu'il est en effet intéressant d'avoir un compte nominatif (unique pour l'utilisateur) qui a un accès sur un ou plusieurs quartiers/enquêtes.
RC : Les accès nominatifs sont en effet la meilleur solution en matière de sécurité. Nous exigeons que l'outil respecte les normes RGPD réglementaire mais la criticité de l'application ne nécessite pas plus de sécurité que celle ci.

### Q7 : `Module #1 : Connexion` : Qu'est-il attendu au sujet du stockage en statique sur l'ordinateur ?

_Il est indiqué dans le cdc que "dans la mesure du possible, le fait de quitter le portail ne doit pas permettre le stock automatique de la liste adresses mails des participants (ou autres données sensibles) en statique sur l’ordinateur"

**R7** : Nous aimerions éviter (si techniquement possible) que les adresses mails des répondants aux enquêtes soient stockées sur le cache du naviguateur utilisé.

### Q8 : `Module #5 : Détection des sphères d’usages` : Pouvez-vous clarifier les modifications possibles par le pilote sur l'algo de détection des SU ?

_Il est indiqué qu'il peut être modifié « deux variables d’entrée » de l’algorithme sans pour autant retrouver de zone de saisie correspondante dans le Miro.

**R8** : Le pilote peut modifier le nombre visé de S.U., la part minimum (i) et le nombre d'itération. Ce sont des zones de saisie et il manque effectivement un menu-déroulant (dans le Miro) pour sélectionner un nombre d'itération. Une solution plus simple que nous pouvons mettre en place est d'avoir une liste de scripts .py qui ont déjà des ensembles de paramètres stockés, et d'excécuter l'un d'eux suivant la sélection de l'utilisateur.

### Q9 : `Module #5 : détection des sphères d’usages` : L'appartenance d'une personne à une SU identifiée par l'algorithme passe forcémenrt par l'appel au second algorithme ?

**R9** : Oui, il est nécessaire de passer par l'algorithme n°2 pour connaître une Sphère d'Usages. Les Sphères d'Usages permettent notamment de catégoriser les données, toute réponse doit être catégorisée et filtrable selon sa S.U.

### Q10 : `Module #5 : détection des sphères d’usages` : Quel interfaçage avec l'algo Python est à prévoir ?

**R10** : Les scripts Python sont fournis. Ce sont des scripts à éxécuter. Il n'y a pas d'API à prévoir.

### Q11 : `Module #6 : découvrir et personnaliser les sphères d’usages` : Y-a-t'il un lien entre la nature de la SU et le nom qui doit lui être attribué ?

**R11** : Les noms n’ont pas de règles de définition propres aux spécificités des SU. Ce sont des noms prédéfinis attribués aléatoirement.

### Q12 : `Module #7 : Suivi d’enquête 2` : Existe-t-il un mécanisme de fin automatique quand un certain nombre de réponses a été obtenu pour chaque questionnaire (comme pour le suivi 1) ?

**R12** : Oui, il y a bien deux seuils différents, un pour l'enquête SU, et un second pour l'enquête MdV+EdV+NGC

### Q13 : `Module #9 : Résultats d’enquêtes` : Le bouton « Comparer les résultats » de ce module est-il un lien vers le Module #10 ?

**R13** : oui, il s'agit d'un lien vers le Module #10

### Q14 : `Module #13 : Enquête 1 : Sphère d’Usages` : Peut-on préciser les fonctionnalités des deux boutons "Voir le détail" et "Comparer" présents sur l'écran de remerciement car non documentés dans le cahier des charges ? 

**R14** : Les boutons "voir le détail" et "comparer" qu'on peut observer en fin d'enquête ne seront pas disponibles en V1. En V2, l'utilisateur pourra comparer une partie de ses réponses avec des données nationales.

### Q15 : `Module #13 : Questionnaire carbone` : Quelle intégration de NGC doit-être prévue pour le questionnaire carbone ?

**R15** : L'ABC sera en charge de développer un questionnaire adapté et assurera le back publicodes du questionnaire. Ce back sera en V1 déployé sur un front spécifique. En v2, si possible il sera envisagé une intégration complète dans la plateforme NEAR.

### Q16 : `Design et maquettage` : Qu'est-il attendu en termes de travail de maquettage et design ?

**R16** : Etant donné que la V1 a avant tout pour objectif d'aboutir à une plateforme fonctionnelle pour conduire nous-même la première enquête, peu de choses sont attendus. Seule, une revue simple du layout général, des questionnaires destinés aux sondés (qui devront être réalisables sur smartphone) et des pages de restitution devront être fait. Pour la V2 un travail de maquettage sera réalisé en amont par RQT et un appui pourra être sollicité.

### Q17 : `Gestion d'envoi des mails` : Doit-on prévoir un outil de gestion d’envoi de mails ?

**R17** : Non nécessaire en V1 mais à intégrer en V2.

### Q18 : `Open source et solutions propriétaire` : Etes-vous ouverts à l'utilisation de solutions propriétaire payantes ?

**R18** : Le code doit être sous licence libre (idéalement stocké sur GitHub comme nos autres projets). Si le logiciel permet une facile contribution des utilisateurs et une réutilisation de l'outil dans le futur nous n'excluons pas les solutions propriétaires payantes si elles permettent de réduire les coûts globaux du projet.
