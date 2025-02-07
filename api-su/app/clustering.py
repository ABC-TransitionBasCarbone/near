from enum import IntEnum
from math import sqrt
import numpy as np
from . import constants


class DataIndex(IntEnum):
    FOOD = 0
    MOBILITY = 1
    DIGITAL = 2
    PURCHASE = 3
    PLANE = 4
    HOME = 5


def convert_to_vector_co2eq(user_data):
    result = np.empty(len(DataIndex))
    # -1 because:
    # value 1 matches element with index 0 of ratio array
    # value 2 matches element with index 1 of ratio array
    # etc.
    result[DataIndex.FOOD.value] = constants.RATIO_FOOD[user_data.get("food") - 1]
    result[DataIndex.MOBILITY.value] = constants.RATIO_MOBILITY[
        user_data.get("mobility") - 1
    ]
    result[DataIndex.DIGITAL.value] = constants.RATIO_DIGITAL[
        user_data.get("digital") - 1
    ]
    result[DataIndex.PURCHASE.value] = constants.RATIO_PURCHASE[
        user_data.get("purchase") - 1
    ]
    result[DataIndex.PLANE.value] = constants.RATIO_PLANE[user_data.get("plane") - 1]
    result[DataIndex.HOME.value] = constants.RATIO_HOME[user_data.get("home") - 1]
    return result


def convert_all_to_vector_co2eq(users_data):
    results = []
    for user_data in users_data:
        result = convert_to_vector_co2eq(user_data)
        results.append(result)
    return results


def distance_euclidean(v1, v2):
    return sqrt(sum((v2[i] - v1[i]) ** 2 for i in range(len(v1))))


def get_closest_cluster(clusters, data_co2eq):
    closest_cluster_index = 0
    min_distance = float("inf")

    for i, cluster in enumerate(clusters):
        cluster_barycenter = cluster.vector
        if len(cluster_barycenter) == len(data_co2eq):
            current_distance = distance_euclidean(cluster_barycenter, data_co2eq)
            if current_distance < min_distance:
                min_distance = current_distance
                closest_cluster_index = i

    return closest_cluster_index, min_distance


def merge_pairs(input_list):
    """
    Merge closest pairs into bigger cluster
    Example: merge_pairs([[1, 2], [2, 3], [4, 5], [3, 4]]) -> [[1, 2, 3, 4, 5]]
    """
    merged = []

    for sublist in input_list:
        sublist_set = set(sublist)
        merged_with_existing = False

        for existing_set in merged:
            if sublist_set & existing_set:  # & = intersection
                existing_set.update(sublist_set)
                merged_with_existing = True
                break

        if not merged_with_existing:
            merged.append(sublist_set)

    return [list(s) for s in merged]


class Cluster:
    def __init__(self, vector, children=[], distance=0.0, index=None, weight=1):
        self.index = index
        self.vector = vector
        self.distance = distance
        self.weight = weight
        self.children = children

    def __repr__(self):
        return (
            f"Cluster(index={self.index}, vector={self.vector}, distance={self.distance}, "
            f"weight={self.weight},  "
            f"children_count={len(self.children)})"
        )


def initialize_clusters(data):
    return [Cluster(vector=data[i].tolist(), index=i) for i in range(len(data))]


def merge_clusters(clusters, pairs, lowest_distance, current_cluster_id):
    cluster_ids_to_delete = []
    for pair in pairs:
        merged_weight = sum(clusters[i].weight for i in pair)
        merged_vector = (
            sum(clusters[i].weight * np.array(clusters[i].vector) for i in pair)
            / merged_weight
        )
        children = [clusters[i] for i in pair]

        if np.any(np.isnan(merged_vector)):
            raise ValueError(f"NaN detected in merged vector: {merged_vector}")

        new_cluster = Cluster(
            vector=merged_vector.tolist(),
            children=children,
            distance=lowest_distance,
            index=current_cluster_id,
            weight=merged_weight,
        )
        clusters.append(new_cluster)
        current_cluster_id -= 1

        cluster_ids_to_delete.extend(pair)

    for index in sorted(cluster_ids_to_delete, reverse=True):
        del clusters[index]

    return current_cluster_id


def h_clustering(data, floor, top, min_count, distance=distance_euclidean):
    clusters = initialize_clusters(data)

    sample_size = len(clusters)
    lowest_weight = 1 / sample_size
    highest_weight = 1 / sample_size

    current_cluster_id = -1
    while len(clusters) > min_count and lowest_weight < floor and highest_weight < top:
        closest_pairs = [[0, 1]]
        lowest_distance = distance(clusters[0].vector, clusters[1].vector)

        for i in range(len(clusters)):
            for j in range(i + 1, len(clusters)):
                d = distance(clusters[i].vector, clusters[j].vector)
                if d < lowest_distance:
                    lowest_distance = d
                    closest_pairs = [[i, j]]
                if d == lowest_distance:
                    closest_pairs.append([i, j])

        merged_pairs = merge_pairs(closest_pairs)
        current_cluster_id = merge_clusters(
            clusters, merged_pairs, lowest_distance, current_cluster_id
        )

        weights = [cluster.weight for cluster in clusters]
        lowest_weight = min(weights) / sample_size
        highest_weight = max(weights) / sample_size

    return clusters, sample_size


def get_user_attributed_su(user_data, clusters):
    su, distance = get_closest_cluster(clusters, convert_to_vector_co2eq(user_data))
    return {
        "user_id": user_data.get("user_id"),
        "su": su + 1,
        "distance_to_barycenter": distance,
    }


def format_computed_su(cluster, i, sample_size):
    return {
        "su": i + 1,
        "pop_percentage": round((cluster.weight / sample_size) * 100, 2),
        "barycenter": cluster.vector,
    }


def run(users_data):
    data_co2eq = convert_all_to_vector_co2eq(users_data)
    clusters, sample_size = h_clustering(
        data_co2eq,
        constants.CLUSTER_MIN_SIZE,
        constants.CLUSTER_MAX_SIZE,
        constants.CLUSTER_NB_MIN,
    )
    return {
        "computed_sus": [
            format_computed_su(cluster, i, sample_size)
            for i, cluster in enumerate(clusters)
        ],
        "user_attributed_su": [
            get_user_attributed_su(user_data, clusters) for user_data in users_data
        ],
    }
