# -*- coding: utf-8 -*-
"""
Created on Wed Apr 26 13:42:21 2023

@author: mattd
"""
from math import sqrt
from PIL import Image,ImageDraw
import extraction
import modulo
from flechage import flechage
import csv
import numpy as np
#entrer adresse des resultats à traiter   !!!!!! format csv !!!!!
#fichier = 'C:\PU\PU Chierarchical\data\mont.csv'
#Belair = 'C:\PU\PU Chierarchical\data\pubelair.csv'
isd = 'C:\PU\PU Chierarchical\data\ISD PU.csv'

def read(lis):
    colnames = ['id','régime','Mtransport','Numérique','Achats','Avion','Chauffage']
    blognames = []
    data = []
    for answer in lis:
        blognames.append(answer[0])
        data.append(list(answer[1:]))
    return(blognames,colnames,data)

def eucl(v1,v2):
    w1 = list(v1)
    w2 = list(v2)
    sum_of_squares = sum((w2[i] - w1[i]) ** 2 for i in range(len(w1)))
    return(sqrt(sum_of_squares))

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
def Hclustering(rows, distance = eucl):
    #Conditions d'arrêts
    Floor = 0.11
    Top = 1
    #initialisations
    distances = {}
    currentclustid = -1
    clust = [cluster(rows[i],ide=i) for i in range(len(rows))]
    samplesize = len(clust)
    lowestweight = 1 / samplesize
    biggestweight = 1 / samplesize 
    #initialisation des distances, calcul des distances point à point
    while len(clust) > 6 and lowestweight < Floor and biggestweight < Top :
        lowestpair = [[0,1]]
        closest = distance(clust[0].vec,clust[1].vec)
        #Calcul de toute les distances
        for i in range(len(clust)):
            for j in range(i+1,len(clust)):
                if np.any(np.isnan(clust[j].vec)):
                    print(clust[j].vec)
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
    return(PU)

#names,col,data = read(extraction.extract(Belair))
#clust = Hclustering(modulo.modulation(data))

#Mnames,Mcol,Mdata = read(extraction.extract(fichier))
#Mclust = Hclustering(modulo.modulation(Mdata))

names,col,data = read(extraction.extract(isd))
clust = Hclustering(modulo.modulation(data))

names.append('cluster')
mod = modulo.modulation(data)
names2,col2,data2 = read(extraction.extract(isd))

for i in range(len(data)):
    data2[i].append(flechage(clust,data[i]))
    data2[i].insert(0,names[i])
data2.append(clust)
chemin_fichier = 'isdpur.csv'
with open(chemin_fichier, mode = 'w', newline = '') as fichier_csv:
    writer = csv.writer(fichier_csv, delimiter = ',')
    writer.writerow(col)
    writer.writerows(data2)
fichier_csv.close()
#to generate, go to python session and enter
#reload(clustering)
#clustering.drawdendrogram(clust,names,jpeg='blogclust.jpg')
