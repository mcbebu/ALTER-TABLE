from flask import Flask, request, render_template

import tensorflow as tf
import numpy as np
from keras.models import load_model

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

    print(estimation)

    return data

if __name__ == "__main__":
    app.run()
