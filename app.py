import json, os
from flask import Flask, render_template, jsonify, abort
app = Flask(__name__)
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
def load(n):
    with open(os.path.join(D, n + ".json"), encoding="utf-8") as f:
        return json.load(f)
@app.context_processor
def ctx():
    return dict(H=load("history"), P=load("places"), S=load("sources"), I=load("interviews"))
PAGES = {"history": "Тарих", "mashyryq": "Машырық қажы", "map": "Тарихи орындар",
         "reconstruction": "3D реконструкция", "school": "Мектеп тарихы", "archive": "Цифрлық архив",
         "oral-history": "Ауызша тарих", "excursion": "Виртуалды экскурсия", "research": "Зерттеу",
         "sources": "Дереккөздер"}
@app.route("/")
def index(): return render_template("index.html", pages=PAGES)
def make(slug):
    def view(): return render_template(slug + ".html", title=PAGES[slug], pages=PAGES)
    view.__name__ = "v_" + slug.replace("-", "_")
    return view
for s in PAGES: app.add_url_rule("/" + s, s, make(s))
@app.route("/api/<name>")
def api(name):
    if name not in ("history", "places", "sources", "interviews"): abort(404)
    return jsonify(load(name))
if __name__ == "__main__":
    app.run(debug=True)
