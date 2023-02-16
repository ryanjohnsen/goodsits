from flask import *
from db_scripts import FlyWheeler

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template("main.html")

@app.route("/add")
def add_location():
    return render_template('add_location.html')

@app.route("/landing") #TODO Change this to index.
def landing():
    return render_template('landing.html')

# Helper for using vscode debugger
if __name__ == "__main__":
    app.run(debug=True)