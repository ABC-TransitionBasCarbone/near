FILENAME = "survey_0.tsv"

# L10 = sample of 10%
L10 = [
    183,
    127,
    133,
    119,
    67,
    99,
    31,
    294,
    298,
    206,
    93,
    83,
    284,
    96,
    20,
    37,
    27,
    252,
    248,
    85,
    123,
    162,
    82,
    169,
    174,
    181,
    15,
    28,
    25,
    59,
    134,
    150,
    230,
    55,
    109,
    131,
    14,
    185,
    26,
    147,
    51,
    9,
    10,
    18,
    62,
    64,
    76,
    89,
    117,
    125,
    170,
    173,
    175,
    188,
    207,
    212,
    221,
    222,
    240,
    241,
    243,
    245,
    246,
    263,
    270,
    273,
    282,
    289,
    304,
    305,
    158,
    176,
    149,
    61,
    110,
    79,
    275,
    196,
    139,
    312,
    247,
    244,
    42,
    72,
    199,
    19,
    313,
    167,
    75,
    65,
    17,
    136,
    115,
    166,
    283,
    161,
    71,
    88,
    239,
    321,
    63,
    234,
    228,
    172,
    213,
    69,
    191,
    260,
    35,
    233,
    223,
    54,
    124,
    120,
    193,
    195,
    269,
    78,
    112,
    141,
    225,
    24,
    211,
    198,
    235,
    310,
    168,
    258,
    288,
    285,
    197,
    165,
    155,
    250,
    4,
    16,
    34,
    57,
    66,
    73,
    77,
    111,
    128,
    129,
    132,
    143,
    146,
    151,
    152,
    171,
    208,
    229,
    238,
    309,
]

MAPPINGS = {
    "meatFrequency": [
        "Aucun repas ou très rarement",
        "Quelques repas",
        "Tous les repas ou presque",
    ],
    "transportationMode": [
        "Mobilités actives (vélo, marche",
        "Transport en commun",
        "Voiture individuelle",
    ],
    "digitalIntensity": [
        "Faible",
        "Bureautique, Internet",
        "Jeux vidéos, streaming, vidéos",
    ],
    "purchasingStrategy": [
        "Occasion en priorité",
        "Mélange occasion/neuf",
        "Achat de neuf systématiquement",
    ],
    "airTravelFrequency": ["0", "1 à 3", "Plus de 3"],
    "heatSource": ["électricité, réseau de chaleur,", "Gaz", "Fioul"],
}

# Expected sus when using the following constants:
# CLUSTER_MIN_SIZE = 0.11
# CLUSTER_MAX_SIZE = 0.4
# CLUSTER_NB_MIN = 3
# RATIO_MEET_FREQUENCY = [200, 1000, 2000]
# RATIO_TRANSPORTATION_MODE = [0, 300, 2300]
# RATIO_DIGITAL_INTENSITY = [90, 180, 360]
# RATIO_PURCHASING_STRATEGY = [400, 800, 1600]
# RATIO_AIR_TRAVEL_FREQUENCY = [0, 800, 2000]
# RATIO_HEAT_SOURCE = [200, 1100, 1600]
EXPECTED_SUS = [
    {
        "barycenter": [200.0, 2300.0, 360.0, 800.0, 800.0, 1100.0],
        "pop_percentage": 0.65,
        "su": 1,
    },
    {
        "barycenter": [2000.0, 2300.0, 360.0, 1600.0, 800.0, 200.0],
        "pop_percentage": 0.65,
        "su": 2,
    },
    {
        "barycenter": [2000.0, 300.0, 180.0, 800.0, 2000.0, 200.0],
        "pop_percentage": 0.65,
        "su": 3,
    },
    {
        "barycenter": [1000.0, 300.0, 270.0, 1600.0, 2000.0, 200.0],
        "pop_percentage": 1.3,
        "su": 4,
    },
    {
        "barycenter": [2000.0, 2300.0, 270.0, 800.0, 2000.0, 200.0],
        "pop_percentage": 2.6,
        "su": 5,
    },
    {
        "barycenter": [2000.0, 0.0, 135.0, 600.0, 0.0, 1100.0],
        "pop_percentage": 1.3,
        "su": 6,
    },
    {
        "barycenter": [2000.0, 2300.0, 270.0, 600.0, 800.0, 1100.0],
        "pop_percentage": 1.3,
        "su": 7,
    },
    {
        "barycenter": [600.0, 2300.0, 180.0, 800.0, 2000.0, 200.0],
        "pop_percentage": 1.3,
        "su": 8,
    },
    {
        "barycenter": [
            2000.0,
            177.27272727272728,
            282.27272727272725,
            727.2727272727273,
            509.09090909090907,
            200.0,
        ],
        "pop_percentage": 14.29,
        "su": 9,
    },
    {
        "barycenter": [2000.0, 2300.0, 252.0, 720.0, 320.0, 200.0],
        "pop_percentage": 6.49,
        "su": 10,
    },
    {
        "barycenter": [
            2000.0,
            214.28571428571428,
            244.28571428571428,
            1600.0,
            114.28571428571429,
            200.0,
        ],
        "pop_percentage": 4.55,
        "su": 11,
    },
    {
        "barycenter": [2000.0, 2300.0, 270.0, 1600.0, 400.0, 1100.0],
        "pop_percentage": 1.3,
        "su": 12,
    },
    {
        "barycenter": [
            2000.0,
            266.6666666666667,
            270.0,
            1333.3333333333333,
            622.2222222222222,
            1100.0,
        ],
        "pop_percentage": 5.84,
        "su": 13,
    },
    {
        "barycenter": [1000.0, 150.0, 315.0, 1200.0, 2000.0, 1100.0],
        "pop_percentage": 2.6,
        "su": 14,
    },
    {
        "barycenter": [
            866.6666666666666,
            2300.0,
            195.0,
            1066.6666666666667,
            133.33333333333334,
            1100.0,
        ],
        "pop_percentage": 3.9,
        "su": 15,
    },
    {
        "barycenter": [1000.0, 2300.0, 292.5, 1050.0, 500.0, 200.0],
        "pop_percentage": 5.19,
        "su": 16,
    },
    {
        "barycenter": [
            819.7183098591549,
            160.56338028169014,
            267.46478873239437,
            985.9154929577464,
            360.5633802816901,
            746.4788732394367,
        ],
        "pop_percentage": 46.1,
        "su": 17,
    },
]
