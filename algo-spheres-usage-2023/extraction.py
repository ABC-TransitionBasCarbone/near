# -*- coding: utf-8 -*-
"""
Created on Thu Apr 27 09:43:55 2023

@author: mattd
"""

import pandas

def extract(i):
    df = pandas.read_csv(i)

    df.columns = ['A','B','C','D','E','F','G']

    df['B'] = df['B'].apply(lambda x: 1 if x == 'Jamais, ou très rarement.' else x)
    df['B'] = df['B'].apply(lambda x: 2 if x =='Dans quelques repas.' else x)
    df['B'] = df['B'].apply(lambda x: 3 if x =='A tous les repas' else x)

    df['C'] = df['C'].apply(lambda x: 3 if x =='Ma voiture personnelle' else x)
    df['C'] = df['C'].apply(lambda x: 2 if x =='Les transporst en commun ou le covoiturage' else x)
    df['C'] = df['C'].apply(lambda x: 1 if x =='Le vélo, la marche, la trottinette...' else x)

    df['D'] = df['D'].apply(lambda x: 2 if x =='Un mélange entre neuf et occasion' else x)
    df['D'] = df['D'].apply(lambda x: 3 if x =='Achat neuf, systématiquement' else x)
    df['D'] = df['D'].apply(lambda x: 1 if x =='L\'occasion en priorité' else x)

    df['E'] = df['E'].apply(lambda x: 1 if x =='0' else x)
    df['E'] = df['E'].apply(lambda x: 2 if x =='1 à 3 fois' else x)
    df['E'] = df['E'].apply(lambda x: 3 if x =='plus de 3 fois' else x)

    df['F'] = df['F'].apply(lambda x: 2 if x =='Le gaz' else x)
    df['F'] = df['F'].apply(lambda x: 1 if x =='L\'électricité ou les réseaux de chaleur' else x)
    df['F'] = df['F'].apply(lambda x: 3 if x =='Le fioul' else x)

    lis = df.values.tolist()
    return(lis)
def read(lis):
    colnames = ['id','régime','Mtransport','Achats','Avion','Chauffage','Numérique']
    blognames = []
    data = []
    for answer in lis:
        blognames.append(answer[0])
        data.append(list(answer[1:]))
    return(blognames,colnames,data)


