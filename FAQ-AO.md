# near-api
## FAQ
QeT : Quartier en Transition
FAQ permettant de répondre aux questions liées au cahier des charges


## 1 Q/R

Q0 : Est ce qu’il est bien question de vous proposer une offre forfaitaire concernant la réalisation de la V1 ?
R0 : On veut une offre forfaitaire (engagement de résultat)

Q1 : Planning
Le lancement du projet étant prévu au 1er décembre, cela laisse peu de temps pour les phases de conception, de développement et la recette. Si on se fie à cette contrainte, on serait sur 2 semaines de conception, 7 semaines de dév, et 2 semaines de recettes.  

Cette contrainte de mars est-elle un jalon incontournable ou un délai + important peut-il être envisagé ?
R1 QeT : La contrainte de mars est incontournable. Cependant, on on peut envisager de migrer certaines fonctionnalités vers la V2 (le suivi de diffusion par exemple) pour avoir un MVP prêt pour conduire une enquête pour la V1. À mon sens (à valider pendant le point technique) la V1 doit au minimum permettre d'initier un premier quartier, de recueillir des questionnaires dans une base de donnée structurée et d'identifier les Sphères d'Usages. On peut aussi faire une sélection dans les visualisations de données et en migrer certaines vers la V2.


Q2 : Conception modulaire
Il est indiqué qu’une conception modulaire est souhaitée, avec un fort découplage des différents modules.
Cette modularité doit-elle

Se retrouver uniquement dans le code produit, avec par exemple une orientation « composant » de la conception
Aller jusqu’à un développement de micro-applications front indépendantes (mais exploitant le même back à priori)
La 2nde alternative va engendrer une plus grande complexité de conception, ce qui nous parait risqué vu les contraintes de planning.

Une architecture micro-frontend pourrait aussi être envisagée, mais on ferait face aux mêmes conséquences de complexité.

R2 : 
ABC : Je pense que nous pouvons nous orienter vers une architecture monolithique par composant mais sans micro-fronts indépendants. Idéalement en se basant sur l'architecture de notre nouvel outil de bilan carbone open source et NGC pour la partie empreinte
QeT : Très bien pour nous.


Q3 : Module #0 – Page d’accueil
Page 8 : il est indiqué que la V1 inclue la construction de quartier avec sélection d'une ou plusieurs zone IRIS.
Nous avons aussi compris que la V1 se focalise sur un seul quartier pilote unique, pré paramétré. Dans ces conditions, cette fonctionnalité nous parait déroutante pour les utilisateurs.
La création de quartier fait elle bien partie de la V1 ? Que doit pouvoir faire l'utilisateur une fois un quartier créé ?

R3 :
ABC : on peut préciser qu’on sera les premiers utilisateurs de la plateforme mais que oui on veut la fonction de sélection de l’IRIS (on sait juste déjà lequel on va sélectionné)
QeT : Ok pour nous.

Q4 : Module #1 : Connexion
Pour la connexion, il est indiqué qu'en V1, la connexion se fait par ID/mot de passe unique, celui-ci pouvant être partagé entre plusieurs utilisateurs.
Le partage d'identifiant de connexion est une pratique fortement déconseillée en termes de sécurité. Chaque identifiant de connexion devrait être associé à une personne identifiée.
Ne serait-il pas plus pertinent de créer des accès nominatifs, rattachés à un même compte au sens fonctionnel ? On pourrait distinguer la notion de compte applicatif, et la notion de compte d'accès (1 compte applicatif dispose de n comptes d'accès). Qu’en pensez-vous ?
R4 : 
ABC : Je pense qu'il est en effet intéressant d'avoir un compte nominatif (unique pour l'utilisateur) qui a un accès sur un ou plusieurs quartiers/enquêtes.
QeT : Il s'agit de veiller à ce que les adresses mails récoltées pendant les enquêtes ne soient pas stockée en cache sur le navigateur. Mais c'est peut-être trop précotioneux ?

 
Q5 : Module #1 : Connexion
Page 10, il est indiqué que "Dans la mesure du possible, le fait de quitter le portail ne doit pas permettre le stock automatique de la liste adresses mails des participants (ou autres données sensibles) en statique sur l’ordinateur"
Je ne comprends pas très bien cette phrase. S’agit-il de ne pas mémoriser l’identifiant de connexion dans l’écran de connexion ? S’agit-il de veiller à ce que des adresses mails ne soient pas stockées dans un cache de navigateur ? Ou autre chose ?

 R5 :
ABC : je pense que ce qu’on veut c’est avant tout de ne pas mémoriser les adresses mails des participants dans le cache. Ne pas pouvoir sauvegarder les identifiants de connexion serait intéressant en terme de sécurité de l’enquête mais je pense que ce n’est pas nécessaire (contraignant pour l’utilisateur + je ne visualise pas encore quels risques peuvent se présenter car on n’est pas sur des données sensibles)
QeT : Oui, il s'agit du premier : les données sensibles des participants ne doivent pas être mémorisées en cache. Pour les ID/MDP laissons la possibilité de sauvgarder. (Avec du recul je vois que c'est peut-être trop précotionneux pour la mise en cache. On peut enlever cette caractéristique si besoin.)

Q6 : Module #5 : détection des sphères d’usages
Page 12 : concernant l'algorithme de détection des SU, il est indiqué que le pilote peut modifier « deux variables d’entrée » de l’algorithme.
La maquette Miro évoque un nombre d'itérations qu’on peut saisir (« définissez un nombre d'itération ») mais pas de zone de saisie correspondante.
On voit aussi deux zones nommées "nombre visé de S-U(n)" et "minimum pop par SU (i)" qui semblent être soit des champs de saisies, soit des boutons d'actions.
Pourriez-vous clarifier quelles sont les 2 variables que le pilote peut modifier svp ?

R6 : 
QeT : Le pilote peut modifier le nombre visé de S.U., la part minimum (i) et le nombre d'itération. Ce sont des zones de saisie et il manque effectivement un menu-déroulant pour sélectionner un nombre d'itération. Une solution plus simple que nous pouvons mettre en place est d'avoir une liste de scripts .py qui ont déjà des ensembles de paramètres stockés, et d'excécuter l'un d'eux suivant la sélection de l'utilisateur.

Q7 : Module #5 : détection des sphères d’usages
Est-ce que l'appartenance d'une personne à une des SU identifiées par l'algorithme est un sujet trivial ou bien faut-il forcément faire appel au 2eme algorithme ?
R7 :
Il est nécessaire de passer par l'algorithme n°2 pour connaître une Sphère d'Usages. Les Sphères d'Usages permettent notamment de catégoriser les données, toute réponse doit être catégorisée selon sa S.U.


Q8 : Module #5 : détection des sphères d’usages
Techniquement, comment s'interface-t-on avec le programme Python ? S'agit-il d'un programme à exécuter sur le système ou existe-t-il une interface de + haut niveau (API par exemple) ?
R8: 
ABC : de ce que j’ai compris c’est un programme à exécuter.
QeT : On peut vous fournir les scripts Python. Pas d'API à prévoir a priori.

Q9 : Module #6 : découvrir et personnaliser les sphères d’usages
Page 13 : il est évoqué un nommage aléatoire et des noms prédéfinis.
Ces noms aléatoires sont-ils sans signification fonctionnelle ou doivent-ils avoir un rapport avec la nature de la SU ?
S’ils dépendent de la nature de la SU, quelles sont les règles à respecter ?
R9 :
ABC : de ce que j’ai compris les noms n’ont pas de règles de définition propres aux spécificités du SU
QeT : effectivement, pas de règle à date

Q10 : Module #7 : Suivi d’enquête 2
Page 14. Existe-t-il, comme pour le suivi 1, un mécanisme de fin automatique quand un certain nombre de réponses a été obtenu pour chaque questionnaire ?
R10 :
ABC : de ce que j’ai compris il y a bien un seuil de fin en termes de représentativité à avoir
QeT : oui, dans les 2 cas. Il y a deux seuils différents, un pour l'enquête SU, et un second pour l'enquête MdV+EdV+NGC

Q11 : Module #9 : Résultats d’enquêtes
Sur plusieurs écrans du module #9, le miro présente un bouton « Comparer les résultats ».
Est ce qu'il s'agit bien d'un simple lien vers le module #10 ? Ou s’agit-il de comparaisons + ciblées ?
R11 :
ABC : j’aurais dit lien vers le module 10 
QeT : oui 👍

Q12 : Module #13 : Enquête 1 : Sphère d’Usages
Dans la maquette Miro de l'écran de remerciement, on peut voir deux boutons non documentés dans le cahier des charges "Voir le détail" et "Comparer".
Pourriez-vous préciser les fonctionnalités accessibles par ces 2 boutons svp ?
R12 : QeT : Ces boutons sont à considérer pour la V2 uniquement, nous devons les enlever.

Q13 : Module #13 : Enquête 2.1 : Empreinte Carbone (CC)
S'agit-il bien de présenter un questionnaire incluant les questions SU et les questions de l'application NGC ?
Comment l'intégration de NGC doit-elle se faire :
Par un simple lien vers l'application
En redéveloppant un front exploitant le "back" Publicode, mais aux couleurs de NEAR
Avec un développement totalement intégré dans NEAR, sans reprise du Publicode

R13  : 
ABC : je dirais ici que c’est fonction du prix car l’option 2 sera moins bien moins cher que l’option 3 (l’option 1 n’est pas pertinente car on veut un NGC adapté). Je propose qu’on parte sur l’option 2 et qu’on garde éventuellement la 3 pour une v2 (voir pour plus tard car c’est avant tout un sujet esthétique produit et non fonctionnalité de la méthode)
QeT : Oui 👍, raccord
