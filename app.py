from flask import *
from typing import Callable
from functools import wraps
from os import environ as env
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from time import time
import db 

app = Flask(__name__)
with app.app_context():
    db.setup() 
app.secret_key = env.get("APP_SECRET_KEY")

oauth = OAuth(app)
oauth.register(
    "auth0",
    client_id = env.get("AUTH0_CLIENT_ID"),
    client_secret = env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs = {
        "scope": "openid profile email",
    },
    server_metadata_url = f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

## Utility Authorization Decorator
def requires_auth(func: Callable) -> Callable:
    @wraps(func)
    def decorator(*args, **kwargs) -> Response:
        if "user" not in session:
            return redirect("/login")

        if session["user"]["expires_at"] > int(time()):
            session.clear()
            return redirect("/login")

        return func(*args, **kwargs)
    return decorator

@app.route("/") #TODO Change this to index.
def landing():
    return render_template('landing.html')

@app.route("/add")
@requires_auth
def add_location():
    return render_template('add_location.html')

@app.route("/add/review", methods = ["POST"])
@requires_auth
def add_review() -> Response:
    loc_id = request.form.get("reviewLocation")
    rating = request.form.get("starRating")
    tags = request.form.get("tags")
    review = request.form.get("review")
    user_id = session["user"]["userinfo"]["sub"]

    if loc_id == None or rating == None or tags == None or review == None or user_id == None:
        return make_response("Review Not Inserted", 400)
    
    db.insert_review(int(loc_id), int(rating), tags, review, user_id)

    return make_response("Review Inserted", 200)

@app.route("/get/reviews", methods = ["GET"])
@requires_auth
def get_reviews() -> Response:
    loc_id = request.args.get("reviewLocation")

    if loc_id == None:
        return make_response("No Location ID Provided", 400)
    
    reviews = db.select_reviews(int(loc_id))

    results = []

    for review in reviews:
        results.append({
            "rating": int(review["rating"]),
            "review": review["review"],
            "tags": review["tags"].split(',')
        })          

    return jsonify(results)

@app.route("/login", methods = ["GET"])
def login() -> Response:
    return oauth.auth0.authorize_redirect(
        redirect_uri = url_for("callback", _external = True)
    )

@app.route("/callback", methods = ["GET", "POST"])
def callback() -> Response:
    try:
        token = oauth.auth0.authorize_access_token()
        session["user"] = token
        return redirect("/")
    except:
        return redirect("/login")

@app.route("/logout", methods = ["GET"])
def logout() -> Response:
    session.clear()
    return redirect(
        f"https://{env.get('AUTH0_DOMAIN')}/v2/logout?"
        + urlencode({
                "returnTo": url_for("landing", _external = True),
                "client_id": env.get("AUTH0_CLIENT_ID"),
            },
            quote_via = quote_plus,
        )
    )

# Helper for using vscode debugger
if __name__ == "__main__":
    app.run(debug=True)
