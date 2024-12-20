# -*- coding: utf-8 -*-
"""
Created on Fri May 12 11:08:55 2023

@author: mattd
"""

from math import sqrt
from PIL import Image,ImageDraw
import extraction
import modulo
from flechage import flechage
import csv

#entrer adresse des resultats à traiter   !!!!!! format csv !!!!!
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
    sum_of_squares = 0
    for i in range(len(v1)):
        sum_of_squares += pow(v2[i] - v1[i], 2)
    return(sqrt(sum_of_squares))

#création d'un classe bicluster similaire à un arbre binaire
#plus fonctions basiques de manipulation de ce nouvel objet
class bicluster:
    def __init__(self,vec,left=None,right=None,distance=0.0,ide=None,poids=1):
        self.left=left
        self.right=right
        self.vec=vec
        self.ide=ide
        self.distance=distance
        self.poids=poids
        
#largeur du bicluster
def getheight(clust):
    #fonction récursive pour calculer la taille d'un bicluster ie nb de feuilles
    if clust.left == None and clust.right == None:
        return 1
    return getheight(clust.left) + getheight(clust.right)
#profondeur
def getdepth(clust):
    if clust.left == None and clust.right == None:
        return 0
    return 1 + max(getdepth(clust.left),getdepth(clust.right))

def Hclustering(rows, distance = eucl):
    egale = 0
    Floor = 0.11
    Top = 1
    distances = {}
    currentclustid = -1
    clust = [bicluster(rows[i],ide=i) for i in range(len(rows))]
    samplesize = len(clust)
    lowestweight = 1/samplesize
    biggestweight = 1/samplesize
    #initialisation des distances, calcul des distances point à point
    #identification des distances min et première gestion des cas d'égalité
    lowestpair = [0,1]
    closest = distance(clust[0].vec,clust[1].vec)
    boucle = 0
                
            
    while len(clust) > 3 and lowestweight < Floor and biggestweight < Top :
        lowestpair = [0,1]
        closest = distance(clust[0].vec,clust[1].vec)
        #Calcul de toute les distances
        for i in range(len(clust)):
            for j in range(i+1,len(clust)):
                boucle += 1
                if (clust[i].ide,clust[j].ide) not in distances:
                    
                    distances[(clust[i].ide,clust[j].ide)] = distance(clust[i].vec,clust[j].vec)
                    
                d = distance(clust[i].vec,clust[j].vec)
                
                if d < closest:
                    closest = d
                    lowestpair = [i,j] 
        for i in range(len(clust)):
            for j in range(i+1,len(clust)):
                d = distance(clust[i].vec,clust[j].vec)
                if d == closest:
                    egale +=  1
        egale -= 1
        mergevec = []
        for i in range(len(clust[lowestpair[0]].vec)):
            m1 = clust[lowestpair[0]].poids
            m2 = clust[lowestpair[1]].poids
            mergevec.append((m1 * clust[lowestpair[0]].vec[i] + 
                             m2 * clust[lowestpair[1]].vec[i]) 
                             / (m1 + m2))
        
        #mergevec = [(clust[lowestpair[0]].vec[i] + clust[lowestpair[1]].vec[i]) / 2.0
        #            for i in range(len(clust[lowestpair[0]].vec))]

        newcluster = bicluster(mergevec,left=clust[lowestpair[0]],right=clust[lowestpair[1]],distance=closest,ide=currentclustid,poids=clust[lowestpair[0]].poids + clust[lowestpair[1]].poids)
        
              
        currentclustid -= 1
        del clust[lowestpair[1]]
        del clust[lowestpair[0]]
        clust.append(newcluster)
        weights = []
        for i in clust:
            weights.append(i.poids)
        lowestweight = min(weights) / samplesize
        biggestweight = max(weights) / samplesize
    PU = []
    for i in clust:
        PU.append((i.vec,i.poids / samplesize))
    print(egale)
    print(boucle)
    return(PU)

#Fonction de tracé de dendrogramme
def drawdendrogram(clust,labels,jpeg = 'clusters.jpg'):
    #height and width  on a alloué 20 pixels in height
    h = getheight(clust) * 20
    w = 1200
    depth = getdepth(clust)
    
    scaling = float(w - 150) / depth
    
    img = Image.new('RGB',(w,h),(255,255,255))
    draw = ImageDraw.Draw(img)
    
    draw.line((0,h/2,10,h/2), fill = (255,0,0))
    
    #draw first node
    drawnode(draw, clust,10,(h/2),scaling,labels)
    img.save(jpeg,'JPEG')
    
def drawnode(draw,clust,x,y,scaling,labels):
    if clust.ide < 0:
        h1 = getheight(clust.left) * 20
        h2 = getheight(clust.right) * 20
        top = y - (h1 + h2) / 2
        bottom = y + (h1 + h2) / 2
        
        l1 = clust.distance * scaling
        
        draw.line((x,top + h1 / 2,x,top + h1 / 2),fill = (255,0,0))
        draw.line((x,bottom - h2 / 2,x,bottom - h2 / 2),fill = (255,0,0))
        
        drawnode(draw,clust.left,x + 11,top + h1 / 2,scaling,labels)
        drawnode(draw,clust.right,x + 11,bottom - h2 / 2,scaling,labels)
        
    else:
        draw.text((x + 5,y - 7),labels[clust.ide],(0,0,0))
        
        
names,col,data = read(extraction.extract(isd))
clust = Hclustering(modulo.modulation(data))

# names,col,data = read(extraction.extract(Belair))
# clust = Hclustering(modulo.modulation(data))

# Mnames,Mcol,Mdata = read(extraction.extract(fichier))
# Mclust = Hclustering(modulo.modulation(Mdata))

# names.append('cluster')
# mod = modulo.modulation(data)
# for i in range(len(data)):
#     data[i].append(flechage(clust,mod[i]))
#     data[i].insert(0,names[i])
# chemin_fichier = 'belaire.csv'
# with open(chemin_fichier, mode = 'w', newline = '') as fichier_csv:
#     writer = csv.writer(fichier_csv, delimiter = ',')
#     writer.writerow(col)
#     writer.writerows(data)
# fichier_csv.close()
# #to generate, go to python session and enter
# #reload(clustering)
# #clustering.drawdendrogram(clust,names,jpeg='blogclust.jpg')
