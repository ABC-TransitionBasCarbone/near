CLUSTER_MIN_SIZE = 0.12  # Pourcentage minimal d'une sphère d'usage
CLUSTER_MAX_SIZE = 0.4  # Pourcentage maximal d'une sphère d'usage
CLUSTER_NB_MIN = 3  # Nombre minimal de sphères d'usage

# Ratio d'équivalent CO2 pour les réponses au questionnaire SU
# Pour chaque question, (ex: Combien de fois prenez-vous l'avion par an ?)
# le tableau [X, Y, Z] correspond au ratio pour :
# X = la première réponse (ex: 0)
# Y = la deuxième réponse (ex: 1 à 3)
# Z = la troisième réponse (ex: Plus de 3)
RATIO_MEET_FREQUENCY = [200, 1000, 2000]
RATIO_TRANSPORTATION_MODE = [0, 300, 2300]
RATIO_DIGITAL_INTENSITY = [90, 180, 360]
RATIO_PURCHASING_STRATEGY = [400, 800, 1600]
RATIO_AIR_TRAVEL_FREQUENCY = [0, 800, 2000]
RATIO_HEAT_SOURCE = [200, 1100, 1600]
