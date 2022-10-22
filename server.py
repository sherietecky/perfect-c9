from sanic import Sanic
from sanic.response import json
import os
if os.name == 'posix':
    import tensorflow as tf
import numpy as np

app = Sanic("predict")


@app.route("/")
def test(request):
    return json({"hello": "world Sanic"})


@app.route("/try_request")
def try_request(request):
    print(request.args["test"][0])
    return json({"args": request.args})
    # return json({ "parsed": True, "args": request.args, "url": request.url, "query_string": request.query_string })
    # print(request.args["filename"][0])


@app.route("/predict")
def predict(request):
    # if os.name != 'posix':
    import tensorflow as tf

    print("hello, you can connect to python server")

    imgSize = 160
    class_names = ['可口可樂', '啤酒', '寶礦力', '橙', '檸檬茶', '牛奶',
                   '牛油果', '益力多', '維他奶', '茄子', '蘋果', '西蘭花', '香蕉']

    model_dir = "./perfect-c9.model_v3"
    predict_Model = tf.keras.models.load_model(model_dir)

    imgPath = "./predict_images/"+request.args["filename"][0]
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

    return json(json_result)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
