CLUSTER_MIN_SIZE = 0.3  # Pourcentage minimal d'une sphère d'usage
CLUSTER_MAX_SIZE = 0.8  # Pourcentage maximal d'une sphère d'usage
CLUSTER_NB_MIN = 3  # Nombre minimal de sphères d'usage

# Ratio d'équivalent CO2 pour les réponses au questionnaire SU
# Pour chaque question, (ex: Combien de fois prenez-vous l'avion par an ?)
# le tableau [X, Y, Z] correspond au ratio pour :
# X = la première réponse (ex: 0)
# Y = la deuxième réponse (ex: 1 à 3)
# Z = la troisième réponse (ex: Plus de 3)
RATIO_FOOD = [200, 1000, 2000]  # Question concernant la nourriture
RATIO_MOBILITY = [0, 300, 2300]  # Question concernant la mobilité
RATIO_DIGITAL = [90, 180, 360]  # Question concernant le numérique
RATIO_PURCHASE = [400, 800, 1600]  # Question concernant les achats
RATIO_PLANE = [0, 800, 2000]  # Question concernant l'avion
RATIO_HOME = [200, 1100, 1600]  # Question concernant le chauffage
