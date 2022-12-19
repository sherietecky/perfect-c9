from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
import numpy as np
import tensorflow as tf
from PIL import Image

app = FastAPI()

print("================== 1. on flask python server ==================")

imgSize = 160
class_names = ['可口可樂', '啤酒', '寶礦力', '橙', '檸檬茶', '牛奶', '牛油果', '益力多', '維他奶', '茄子', '蘋果', '西蘭花', '香蕉']

model_dir = "./perfect-c9.model_v3"
predict_Model = tf.keras.models.load_model(model_dir)

print("================== 2. model loaded ==================")

@app.get("/")
async def root():
    return {"message": "Hello World"}

# @app.route('/try', methods=['GET'])
# def search():
#     args = request.args
#     return args

@app.get("/predict/{filename}")
async def search(filename):
    imgPath = "./predict_images/"+filename
    image = tf.keras.preprocessing.image.load_img(
        imgPath, color_mode="rgb", target_size=(imgSize, imgSize))

    input_arr = tf.keras.preprocessing.image.img_to_array(image)  # [0,255]

    input_arr = np.array([input_arr])

    prediction = predict_Model.predict(input_arr)

    prediction_Argsort = np.argsort(prediction[0])[::-1]

    topK = 3
    json_result = {}
    for i in range(topK):
        result_label = class_names[prediction_Argsort[i]]
        result_poss = prediction[0][prediction_Argsort[i]] * 100

        print(f"Rank{i+1}: Is that {result_label} ? ({result_poss}% possibility)")

        if i == 0:
            json_result["result"] = result_label
            json_result["possibility"] = result_poss

    return jsonable_encoder(json_result)
