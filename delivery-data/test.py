import requests
from google.cloud import storage
import tensorflow as tf
from keras.models import load_model

storage_client = storage.Client()
bucket_name = "alter-table-time-estimation"
bucket = storage_client.create_bucket(bucket_name)

print(f"Bucket {bucket.name} created.")
