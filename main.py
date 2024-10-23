import tensorflow as tf
from tensorflow import keras
import base64
import io
from PIL import Image
import cv2
import numpy as np
import sys
import paho.mqtt.client as mqtt
import random

model = tf.keras.models.load_model('model.h5')

def stringToRGB(base64_string):
    imgdata = base64.b64decode(base64_string)
    dataByteIO = io.BytesIO(imgdata)
    image = Image.open(dataByteIO)
    image = cv2.resize(np.array(image), dsize=(224, 224))
    return image
    #return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

def image_to_pred(image):
    #image_a = image.astype(float) / 255
    image = tf.expand_dims(image, 0)
    return image

def on_message(client, userdata, message):
    topic = message.topic.split('/')
    print(topic)
    if topic[1] == "camera":
        payload = str(message.payload.decode("utf-8"))
        image = stringToRGB(payload)
        data = image_to_pred(image)
        predict = model.predict(data)
        print(predict)
        client.publish(topic[0]+"/AI", int(np.argmax(predict)))
    return


broker_address = ""
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "AI")
client.connect(broker_address)
client.subscribe("+/camera")
client.on_message = on_message
client.loop_forever()