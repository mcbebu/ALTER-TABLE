# Importing required functions
from flask import Flask, request, render_template
import tensorflow as tf

import numpy as np
import pandas as pd

import tensorflow as tf
from tensorflow.keras import layers


model = tf.keras.Sequential([
  layers.Dense(64, input_shape=(3, )),
  layers.ReLU(),
  layers.Dense(512),
  layers.ReLU(),
  layers.Dense(512),
  layers.ReLU(),
  layers.Dense(32),
  layers.ReLU(),
  layers.Dense(1)
])

model.build()

model.compile(loss = tf.keras.losses.MeanSquaredError(),
              optimizer = tf.keras.optimizers.Adam())

model.load_weights('./delivery-data/model/model.h5')

model.evaluate(np.array([1, 2, 3]))

# Flask constructor
app = Flask(__name__)

# Root endpoint
@app.route('/', methods=['GET'])
def index():
	## Display the HTML form template
	return render_template('index.html')

# `read-form` endpoint
@app.route('/read-form', methods=['POST'])
def read_form():

	# Get the form data as Python ImmutableDict datatype
	data = request.form

	## Return the extracted information

	data = {
		'time'	 : data['ggmapsTime'],
		'stop' : data['numStop'],
		'customer' : data['numCustomer'],
	}

	return data

# Main Driver Function
if __name__ == '__main__':
	# Run the application on the local development server
	app.run()
