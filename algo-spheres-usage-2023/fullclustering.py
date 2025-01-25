# -*- coding: utf-8 -*-
"""
Created on Wed Apr 26 13:42:21 2023

@author: mattd
"""
from math import sqrt, isnan
import pandas # type: ignore
import csv
import numpy as np # type: ignore

#fonctions auxilieres au clustering precedemment dans des fichiers separes
#la fonction extraction permet de recuperer les reponses d'un tableau csv du questionnaire
def extraction(i,ech):
    L10=[183, 127, 133, 119, 67, 99, 31, 294, 298, 206, 93, 83, 284, 96, 20, 37, 27, 252, 248, 85, 123, 162, 82, 169, 174, 181, 15, 28, 25, 59, 134, 150, 230, 55, 109, 131, 14, 185, 26, 147, 51, 9, 10, 18, 62, 64, 76, 89, 117, 125, 170, 173, 175, 188, 207, 212, 221, 222, 240, 241, 243, 245, 246, 263, 270, 273, 282, 289, 304, 305, 158, 176, 149, 61, 110, 79, 275, 196, 139, 312, 247, 244, 42, 72, 199, 19, 313, 167, 75, 65, 17, 136, 115, 166, 283, 161, 71, 88, 239, 321, 63, 234, 228, 172, 213, 69, 191, 260, 35, 233, 223, 54, 124, 120, 193, 195, 269, 78, 112, 141, 225, 24, 211, 198, 235, 310, 168, 258, 288, 285, 197, 165, 155, 250, 4, 16, 34, 57, 66, 73, 77, 111, 128, 129, 132, 143, 146, 151, 152, 171, 208, 229, 238, 309]


    df = pandas.read_csv(i, sep='\t',usecols=[0,2,3,4,5,6,7])

    df.columns = ['A','B','C','D','E','F','G']
    if ech:
        df=df.loc[df['A'].isin(L10)]

    df['B'] = df['B'].apply(lambda x: 1 if x == 'Aucun repas ou très rarement' else x)
    df['B'] = df['B'].apply(lambda x: 2 if x =='Quelques repas' else x)
    df['B'] = df['B'].apply(lambda x: 3 if x =='Tous les repas ou presque' else x)

    df['C'] = df['C'].apply(lambda x: 1 if x =='Mobilités actives (vélo, marche' else x)
    df['C'] = df['C'].apply(lambda x: 2 if x =='Transport en commun' else x)
    df['C'] = df['C'].apply(lambda x: 3 if x =='Voiture individuelle' else x)

    df['D'] = df['D'].apply(lambda x: 1 if x =='Faible' else x)
    df['D'] = df['D'].apply(lambda x: 2 if x =='Bureautique, Internet' else x)
    df['D'] = df['D'].apply(lambda x: 3 if x =='Jeux vidéos, streaming, vidéos' else x)

    df['E'] = df['E'].apply(lambda x: 1 if x =='Occasion en priorité' else x)
    df['E'] = df['E'].apply(lambda x: 2 if x =='Mélange occasion/neuf' else x)
    df['E'] = df['E'].apply(lambda x: 3 if x =='Achat de neuf systématiquement' else x)

    df['F'] = df['F'].apply(lambda x: 1 if x =='0' else x)
    df['F'] = df['F'].apply(lambda x: 2 if x =='1 à 3' else x)
    df['F'] = df['F'].apply(lambda x: 3 if x =='Plus de 3' else x)

    df['G'] = df['G'].apply(lambda x: 1 if x =='électricité, réseau de chaleur,' else x)
    df['G'] = df['G'].apply(lambda x: 2 if x =='Gaz' else x)
    df['G'] = df['G'].apply(lambda x: 3 if x =='Fioul' else x) 

    lis = df.values.tolist()
    '''
    for u in lis:
        for i in u:
            if isnan(i):
                print('un des usagers n a pas bien rempli le questionnaire!',u)
                exit()
    '''
    return(lis)

#la fonction modulation permet de passer des reponses qualitatives a quantitatives en CO2eq
def modulation(lis,listcoefs):
    for i in lis:
        
        if i[0] == 1:
            i[0] = listcoefs[0][0]
        if i[0] == 2:
            i[0] = listcoefs[0][1]
        if i[0] == 3:
            i[0] = listcoefs[0][2]
        if i[1] == 1:
            i[1] = listcoefs[1][0]
        if i[1] == 2:
            i[1] = listcoefs[1][1]
        if i[1] == 3:
            i[1] = listcoefs[1][2]
        if i[2] == 1:
            i[2] = listcoefs[2][0]
        if i[2] == 2:
            i[2] = listcoefs[2][1]
        if i[2] == 3:
            i[2] = listcoefs[2][2]
        if i[3] == 1:
            i[3] = listcoefs[3][0]
        if i[3] == 2:
            i[3] = listcoefs[3][1]
        if i[3] == 3:
            i[3] = listcoefs[3][2]
        if i[4] == 1:
            i[4] = listcoefs[4][0]
        if i[4] == 2:
            i[4] = listcoefs[4][1]
        if i[4] == 3:
            i[4] = listcoefs[4][2]
        if i[5] == 1:
            i[5] = listcoefs[5][0]
        if i[5] == 2:
            i[5] = listcoefs[5][1]
        if i[5] == 3:
            i[5] = listcoefs[5][2]
    return(lis)

#la fonction eucl permet de calculer la distance euclidienne entre 2 vecteurs ie combinaisons de x nombres
def eucl(v1,v2):
    w1 = list(v1)
    w2 = list(v2)
    sum_of_squares = sum((w2[i] - w1[i]) ** 2 for i in range(len(w1)))
    return(sqrt(sum_of_squares))

#la fonction flechage permet de trouver la SU la plus proche en fonction des reponses au questionnaire
def flechage(clust,l):
    d = eucl(clust[0][0],l)
    closest = 0
    for i in range(1,len(clust)):
        if len(clust[i][0]) == len(l):
            if eucl(clust[i][0],l) < d:
                d = eucl(clust[i][0],l)
                closest = i
    return(closest)



#fonctions principales precedement dans le fichier coeur

def read(lis):
    colnames = ['id','régime','Mtransport','Numérique','Achats','Avion','Chauffage']
    blognames = []
    data = []
    for answer in lis:
        blognames.append(answer[0])
        data.append(list(answer[1:]))
    return(blognames,colnames,data)

#création d'un classe bicluster similaire à un arbre binaire
#plus fonctions basiques de manipulation de ce nouvel objet
class cluster:
    def __init__(self,vec,fils=[],distance=0.0,ide=None,poids=1):
        self.fils=fils
        self.vec=vec
        self.ide=ide 
        self.distance=distance
        self.poids=poids
        
#largeur du bicluster
def getheight(clust):
    #fonction récursive pour calculer la taille d'un bicluster ie nb de feuilles
    if len(clust.fils) == 0:
        return 1
    return sum(getheight(i) for i in clust.fils)
#profondeur
def getdepth(clust):
    if clust.left == None and clust.right == None:
        return 0
    return 1 + max(getdepth(i) for i in clust.fils)
#prend une list et regroupe les pairs en cluster si certaine pair sont une chaine
def merging(L):
    i = 0
    while i < len(L):
        j = 0
        while j < len(L[i]):
            k = i + 1
            while k < len(L):
                if L[i][j] in L[k]:
                    intermediate = set (L[k]) - set (L[i])
                    L[i] = L[i] + list(intermediate)
                    del L[k]
                else: 
                    k += 1
            j += 1
            if not (i < len(L)):
                break
        i += 1
    return(L)
#clustering hierarchique sur les lignes Rows suivant la distance indiqué
def Hclustering(rows, Floor, Top, Mincount, distance = eucl):
    #initialisations
    distances = {}
    currentclustid = -1
    clust = [cluster(rows[i],ide=i) for i in range(len(rows))]
    for i in range(len(clust)):
            for j in range(i+1,len(clust)):
                if np.any(np.isnan(clust[j].vec)):
                    print(clust[j].vec, 'pb init')
                    exit()
    samplesize = len(clust)
    lowestweight = 1 / samplesize
    biggestweight = 1 / samplesize 
    #initialisation des distances, calcul des distances point à point
    while len(clust) > Mincount and lowestweight < Floor and biggestweight < Top :
        lowestpair = [[0,1]]
        closest = distance(clust[0].vec,clust[1].vec)
        #Calcul de toute les distances
        for i in range(len(clust)):
            for j in range(i+1,len(clust)):
                if np.any(np.isnan(clust[j].vec)):
                    print(clust[j].vec, len(clust))
                if (clust[i].ide,clust[j].ide) not in distances:
                    distances[(clust[i].ide,clust[j].ide)] = distance(clust[i].vec,clust[j].vec)
                    
                d = distance(clust[i].vec,clust[j].vec)
                
                if d < closest:
                    closest = d
                    lowestpair = [[i,j]]
                if d == closest:
                    lowestpair.append([i,j])
                    
        # MERGE DE LA LISTE lowestpair  IDENTIFICATION DES RESEAUX 
        lowestpair = merging(lowestpair)
        #Calcul des nvx cluster, ajout à la liste et supression des clusters fuisionnés
        suppr = []
        for item in lowestpair:
            M = sum(clust[i].poids for i in item)
            if M == 0:
                print(len(clust))
            mergevec = [clust[item[0]].poids * i for i in clust[item[0]].vec]
            fils = []
            for i in range(len(item)) : 
                if i != 0:
                    for j in range (len(mergevec)):
                        mergevec[j] += clust[item[i]].poids * clust[item[i]].vec[j]
                fils.append(clust[item[i]])
            for i in range(len(mergevec)):
                mergevec[i] = mergevec[i] / M
            nan_mask = np.isnan(mergevec)
            if np.any(nan_mask):
                print(len(clust),item)
            newcluster = cluster(vec = mergevec,fils = fils,distance = closest,ide = currentclustid,poids = M)
        
            currentclustid -= 1
            for i in item:
                suppr.append(i)
            clust.append(newcluster)
        suppr.sort(reverse = True)
        for i in suppr:
            del clust[i]
            
        #Actualisation des conditions d'arrêts
        weights = []
        for i in clust:
            weights.append(i.poids)
        lowestweight = min(weights) / samplesize
        biggestweight = max(weights) / samplesize
    #Récupérations des seules données qui nous interessent : Barycentre et proportion de chaque PU
    PU = []
    for i in clust:
        PU.append((i.vec,i.poids / samplesize))
    print([str(i[0])+str(round(i[1]*100,2))+'%' for i in PU], len(PU))
    return(PU)

#--------------------------------------------------------------
#--------------------------EXECUTION---------------------------
#--------------------------------------------------------------


#entrer adresse des resultats à traiter   !!!!!! format csv !!!!!
isd = '202306_Export_Base_PU.xlsx - survey_0.tsv'
#entrer les coefficients
#ordre des secteurs 0alimentation, 1transport, 2numérique, 3achats, 4avion, 5chauffage
L_coefs=[[200,1000,2000],[0,300,2300],[90,180,360],[400,800,1600],[0,800,2000],[200,1100,1600]]
#entrer les conditions d'arret, taille minimale cluster, taille max cluster et nombre de clusters min
Taillemin=0.11
Taillemax=0.4
Nbmin=3

#extraction des donnees du quest et conversion en tonnes de co2
names,col,data = read(extraction(isd,True))
clust = Hclustering(modulation(data,L_coefs), Taillemin, Taillemax, Nbmin)

names.append('cluster')
mod = modulation(data, L_coefs)
names2,col2,data2 = read(extraction(isd,False))

datall=modulation(data2,L_coefs)

for i in range(len(data2)):
    data2[i].append(flechage(clust,datall[i]))
    data2[i].insert(0,names2[i])
data2.append(clust)
chemin_fichier = 'isdpur.csv'
with open(chemin_fichier, mode = 'w', newline = '') as fichier_csv:
    writer = csv.writer(fichier_csv, delimiter = ',')
    writer.writerow(col2)
    writer.writerows(data2)
fichier_csv.close()
#to generate, go to python session and enter
#reload(clustering)



