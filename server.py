from sanic import Sanic
from sanic.response import json
import tensorflow as tf
import numpy as np

app = Sanic("my-hello-world-sanic")

@app.route("/")
def test(request):
    return json({"hello": "world Sanic"})


@app.route("/recognize")
def test(request):
    imgSize = 160
    class_names = ['可口可樂', '橙', '牛油果', '維他奶', '茄子', '蘋果', '西蘭花', '香蕉']

    model_dir = "./myTrainingModel.h5"
    predict_Model = tf.keras.models.load_model(model_dir)

    imgPath = "./predict_images/coke.jpg"



    image = tf.keras.preprocessing.image.load_img(imgPath, color_mode="rgb", target_size=(imgSize, imgSize))


    input_arr = tf.keras.preprocessing.image.img_to_array(image)  # [0,255]

    input_arr = np.array([input_arr])


    prediction = predict_Model.predict(input_arr)

# Doing arg sork for obtain highest possibility ranking
    prediction_Argsort = np.argsort(prediction[0])[::-1]

# topK = 3
# for i in range(topK):
#     result_label = class_names[prediction_Argsort[i]]
#     print(result_label)

# Get the top 3 possibility result
    topK = 3
    for i in range(topK):
        result_label = class_names[prediction_Argsort[i]]
        result_poss = prediction[0][prediction_Argsort[i]] * 100

        # print(f"Rank{i+1}: Is that {result_label} ? ({result_poss}% possibility)")
        result = f"Rank{i+1}: Is that {result_label} ? ({result_poss}% possibility)"
    return json({"result": result})


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8000)

