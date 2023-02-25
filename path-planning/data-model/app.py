from flask import Flask, request, render_template

import tensorflow as tf
import numpy as np
from keras.models import load_model

def time_estimation(ggmap_time, numStop, numCustomer, timePerStop=5, timePerCustomer=2):

    estimation = ggmap_time * 1.1 + timePerStop * numStop + timePerCustomer * numCustomer
    estimation = estimation + (np.abs(np.random.normal(0, 0.2)) - 0.1) * estimation

    return np.round(estimation, 0)

model = load_model('./model/model.h5')

model.compile(loss = tf.keras.losses.MeanSquaredError(),
              optimizer = tf.keras.optimizers.Adam())

print(model.predict(np.array([[10, 2, 3]])))

app = Flask(__name__)
info = {}
estimation = 0

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', est=estimation)


@app.route('/read-form', methods=['POST'])
def read_form():
    data = request.form
    
    info = {
        'time': int(data['ggmapsTime']),
        'stop': int(data['numStop']),
        'customer': int(data['numCustomer'])
    }

    estimation = model.predict(np.array([[
        info['time'], info['stop'], info['customer']
    ]]))[0][0]

    estimation = estimation if estimation > 0 else time_estimation(info['time'], info['stop'], info['customer'])

    print(estimation)

    return render_template('index.html', est=estimation)

if __name__ == "__main__":
    app.run()
