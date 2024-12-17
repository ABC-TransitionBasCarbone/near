# -*- coding: utf-8 -*-
"""
Created on Fri May 19 08:13:15 2023

@author: mattd
"""
#ordre des secteurs alimentation, transport, achats, avion, chauffage, numérique

def modulation(lis):
    for i in lis:
        
        if i[0] == 1:
            i[0] = 365
        if i[0] == 2:
            i[0] = 1000
        if i[0] == 3:
            i[0] = 2200
        if i[1] == 1:
            i[1] = 500
        if i[1] == 2:
            i[1] = 1000
        if i[1] == 3:
            i[1] = 3000
        if i[2] == 1:
            i[2] = 62
        if i[2] == 2:
            i[2] = 300
        if i[2] == 3:
            i[2] = 630
        if i[4] == 1:
            i[4] = 330
        if i[4] == 2:
            i[4] = 2090
        if i[4] == 3:
            i[4] = 3000
        if i[3] == 1:
            i[3] = 0
        if i[3] == 2:
            i[3] = 1500
        if i[3] == 3:
            i[3] = 3500
        if i[5] == 1:
            i[5] = 32
        if i[5] == 2:
            i[5] = 130
        if i[5] == 3:
            i[5] = 390
    return(lis)