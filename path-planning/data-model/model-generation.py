import numpy as np
import pandas as pd
import tensorflow as tf
from keras import layers
from keras.models import load_model
from sklearn.model_selection import train_test_split

def time_estimation(ggmap_time, numStop, numCustomer, timePerStop=5, timePerCustomer=2):

    estimation = ggmap_time * 1.1 + timePerStop * numStop + timePerCustomer * numCustomer
    estimation = estimation + (np.abs(np.random.normal(0, 0.2)) - 0.1) * estimation

    return np.round(estimation, 0)

path = [0, 1, 2, 3, 8, 10, 9, 7, 6, 5, 4, 0]
order = [0, 1, 2, 3, 10, 9, 8, 7, 4, 6, 5]
cumTime = [0, 14, 19, 22, 29, 39, 43, 47, 51, 56, 60, 73]
cumDistance = [0, 5.6, 7.4, 8.6, 10.7, 13.2, 14.2, 15.2, 16.1, 17.4, 18.1, 22.5]

df = pd.read_csv("./data-model/user-data.csv").drop(['Unnamed: 0'], axis=1)

cumCustomer = [0] + list(df.groupby("addressID").count().userID.cumsum())

df["timeEstimation"] = df.apply(
    lambda x: time_estimation(cumTime[order[x.addressID]], order[x.addressID], cumCustomer[x.addressID]), 
    axis=1
)

train, test = train_test_split(df, test_size=0.2)

train_features = train.copy()
train_labels = train_features.pop('timeEstimation')
train_features.pop("userID")
train_features = np.array(train_features)
address = train_features[:, 1]
train_features[:, 0] = np.array(list(map(lambda x: cumTime[order[x]], address)))
train_features[:, 1] = np.array(list(map(lambda x: order[x], address)))
train_features[:, 2] = np.array(list(map(lambda x: cumCustomer[x], address)))

test_features = test.copy()
test_labels = test_features.pop('timeEstimation')
test_features.pop("userID")
test_features = np.array(test_features)
address = test_features[:, 1]
test_features[:, 0] = np.array(list(map(lambda x: cumTime[order[x]], address)))
test_features[:, 1] = np.array(list(map(lambda x: order[x], address)))
test_features[:, 2] = np.array(list(map(lambda x: cumCustomer[x], address)))

normalize = layers.Normalization()
normalize.adapt(train_features)

model = tf.keras.Sequential([
  normalize,
  layers.Dense(64),
  layers.ReLU(),
  layers.Dense(512),
  layers.ReLU(),
  layers.Dense(512),
  layers.ReLU(),
  layers.Dense(32),
  layers.ReLU(),
  layers.Dense(1)
])

model.compile(loss = tf.keras.losses.MeanSquaredError(),
              optimizer = tf.keras.optimizers.Adam())

model.fit(train_features, train_labels, epochs=1000)

model.trainable = False

model.save('./data-model/model/model.h5')
