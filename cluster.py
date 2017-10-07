import csv
import sys
import pprint
from collections import defaultdict
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
from format_data import audit_experience, audit_height, audit_fitness, audit_throwing


def extract_fields(line_dict):
    return (line_dict["name"],
            audit_experience(line_dict["experience"]),
            audit_height(line_dict["height"]),
            audit_throwing(line_dict["throwing_skill"]),
            audit_fitness(line_dict["fitness"]),
            line_dict["gender"])


def split_by_gender(data):
    girls = data[data[:,5] == "Female"]
    boys = data[data[:,5] == "Male"]
    assert len(girls) + len(boys) == len(data)
    return girls, boys


def weight_features(dataset):
    weighted = dataset
    # experience
    weighted[:,1] *= 0.5
    # height in cm
    weighted[:,2] /= 100.
    # throwing skill
    weighted[:,3] *= 1
    # fitness
    weighted[:,4] *= 1
    return weighted


def cluster_by_skills(dataset):
    weighted_data = weight_features(dataset)
    features = weighted_data[:, [1, 2, 3, 4]]
    features = weighted_data[:, [1, 3, 4]]  # no height
    algorithm = KMeans(n_clusters=12)
    algorithm.fit(features)
    clusters = group_by_label(algorithm.labels_, dataset)
    return clusters


def group_by_label(labels, data):
    assert len(labels) == len(data)
    teams = defaultdict(list)
    for label, player in zip(labels, data):
        teams[label].append(list(player))
    return teams


def sort_by_sum_of_skills():
    pass


def main():
    assert len(sys.argv) > 1
    filename = sys.argv[1]
    with open(filename) as f:
        reader = csv.DictReader(f)
        dataset = list(reader)
        dataset = np.array([extract_fields(line) for line in dataset],
                           dtype=np.dtype([("name", "U"),
                                           ("experience", np.float),
                                           ("height", np.float),
                                           ("throwing skill", np.float),
                                           ("fitness", np.float),
                                           ("gender", "U")]))
        print(dataset[0:5])
        girls, boys = split_by_gender(dataset)

    for subset in [girls, boys]:
        clusters = cluster_by_skills(subset)
        pprint.pprint(clusters)

    #with open("clustering_KMeans_12.txt", "w") as f:
    #    for


if __name__ == "__main__":
    main()
