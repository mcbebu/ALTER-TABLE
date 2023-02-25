
import tensorflow as tf
import numpy as np
from keras.models import load_model

model = load_model('./model/model.h5')

model.compile(loss = tf.keras.losses.MeanSquaredError(),
              optimizer = tf.keras.optimizers.Adam())

model.summary()

print(model.predict(np.array([[1, 2, 3]])))