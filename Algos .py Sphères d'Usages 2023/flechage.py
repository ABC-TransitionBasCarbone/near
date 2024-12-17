# -*- coding: utf-8 -*-
"""
Created on Fri May 19 08:31:50 2023

@author: mattd
"""
from math import sqrt
from PIL import Image,ImageDraw

def eucl(v1,v2):
    w1 = list(v1)
    w2 = list(v2)
    if len(w1) == len(w2):
        sum_of_squares = sum((w2[i] - w1[i]) ** 2 for i in range(len(w1)))
    else:
        return(print('ERROR'))
    return(sqrt(sum_of_squares))


def flechage(clust,l):
    d = eucl(clust[0][0],l)
    closest = 0
    for i in range(1,len(clust)):
        if len(clust[i][0]) == len(l):
            if eucl(clust[i][0],l) < d:
                d = eucl(clust[i][0],l)
                closest = i
    return(closest)
            
    
    