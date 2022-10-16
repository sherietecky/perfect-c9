from sanic import Sanic
from sanic.response import json

app = Sanic("my-hello-world-sanic")

@app.route("/")
def test(request):
    return json({"hello": "world Sanic"})

if __name__ == "__main__":
    app.run(host="perfect-c9.homes", port=8000)