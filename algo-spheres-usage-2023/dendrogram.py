# -*- coding: utf-8 -*-
"""
Created on Fri Apr 28 09:09:06 2023

@author: mattd
"""

*
import clustering

blognames,words,data = clustering.read('DMontesson.csv')
clust = clustering.hcluster(data)

class bicluster:
    def _init__(self,vec,left=None,right=None,distance=0.0,id=None):
        self.left=left
        self.right=right
        self.vec=vec
        self.id=id
        self.distance=distance
        
def getheight(clust):
    #fonction récursive pour calculer la taille d'un bicluster ie nb de feuilles
    if clust.left == None and clust.right == None:
        return 1
    return getheight(clust.left) + getheight(clust.right)

def getdepth(clust):
    if clust.left == None and clust.right == None:
        return 0
    return 1 + max(getdepth(clust.left),getdepth(clust.right))

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
    if clust.id < 0:
        h1 = getheight(clust.left) * 20
        h2 = hetheight(clust.right) * 20
        top = y - (h1 + h2) / 2
        bottom = y + (h1 + h2) / 2
        
        l1 = clust.distance * scaling
        
        drawline((x,top + h1 / 2,x,top + h1 / 2),fill = (255,0,0))
        drawline((x,bottom - h2 / 2,x,bottom - h2 / 2),fill = (255,0,0))
        
        drawnode(draw,clust.left,x + 11,top + h1 / 2,scaling,labels)
        drawnode(draw,clust.right,x + 11,bottom - h2 / 2,scaling,labels)
        
    else:
        draw.text((x + 5,y - 7),labels[clust.id],(0,0,0))
        
#to generate, go to python session and enter
#reload(clustering)
#clustering.drawdendrogram(clust,blognames,jpeg='blogclust.jpg')