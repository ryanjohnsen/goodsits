from flask import *
from db_scripts import FlyWheeler

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello World</p>"

# Helper for using vscode debugger
if __name__ == "__main__":
    app.run(debug=True)