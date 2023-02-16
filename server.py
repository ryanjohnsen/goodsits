from flask import *
from db_scripts import FlyWheeler

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello World</p>"

@app.route("/add")
def add_location():
    return render_template('add_location.html')

# Helper for using vscode debugger
if __name__ == "__main__":
    app.run(debug=True)