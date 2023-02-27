from flask import *
from typing import Callable
from functools import wraps
from os import environ as env
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from werkzeug.utils import secure_filename
from base64 import b64encode, b64decode
from io import BytesIO
from time import time
import db 

app = Flask(__name__)
with app.app_context():
    db.setup() 
app.secret_key = env.get("APP_SECRET_KEY")
app.config["JSON_SORT_KEYS"] = False

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
        session["path"] = request.path
        if not session.get("user"):
            return redirect("/login")
        
        if session["user"]["expires_at"] <= int(time()):
            session.clear()
            session["path"] = request.path
            return redirect("/login")

        return func(*args, **kwargs)
    return decorator

def check_auth() -> dict[str, str]:
    state = "logout" if session.get("user") else "login"
    return {"link": f"/{state}", "status": state.capitalize()}

@app.route("/")
def landing():
    return render_template('landing.html', login = check_auth())

@app.route("/add")
@requires_auth
def add_location():
    print()
    return render_template('add_location.html', login = check_auth())

@app.route("/location/<int:loc_id>/add", methods = ["POST"])
@requires_auth
def add_review(loc_id: int) -> Response:
    rating = request.form.get("starRating")
    tags = request.form.get("tags")
    review = request.form.get("review")
    user_id = session["user"]["userinfo"]["sub"]

    if loc_id == None or rating == None or tags == None or review == None or user_id == None:
        return make_response("Review Not Inserted", 400)
    
    db.insert_review(int(loc_id), int(rating), tags, review, user_id)

    return make_response("Review Inserted", 200)

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
        return redirect(session.get("path", "/"))
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

@app.route("/images/<int:image_id>", methods = ["GET"])
def image(image_id: int) -> Response:
    image = db.get_image(image_id)
    
    stream = BytesIO(b64decode(image[0]))

    return send_file(stream, download_name = "file.jpg")

@app.route("/search", methods = ["GET"])
def search() -> Response:
    location = request.args.get("location", "0,0")
    miles = request.args.get("miles")
    tags = request.args.get("tags")

    locations, results = db.search_locations(location, miles, tags), []
    for loc in locations:
        results.append({
            "id": loc[0],
            "title": loc[1],
            "hours": loc[2],
            "location": loc[3],
            "tags": loc[4]
        })
    
    return jsonify(results)

@app.route("/location", methods = ["POST"])
@requires_auth
def new_location() -> Response:
    # TODO: switch form to call js function to get var instead of just html form submit? maybe
    data = request.form
    required_info = ["title", "description", "tags", "location"] #"user_id"]
    # optional_info = ["hours", "image"] (none values are okay)
    for key in required_info:
        if data[key] == None:
            return make_response(f"Missing {key}; Location not Inserted", 400)

    file = request.files['image']
    filename = secure_filename(file.filename)
    image = None
    if filename != '':
        image = b64encode(file.read())

    id = db.insert_location(
        data["title"], data["description"], data["hours"],
        image, data["tags"], data["location"], session["user"]["userinfo"]["aud"]
    )
    return redirect("/location/" + str(id))
    
@app.route("/location/<int:loc_id>", methods = ["GET"])
def location(loc_id: int) -> Response:
    reviews = db.get_reviews(loc_id)
    for review in reviews:
        review["tags"] = [x.strip() for x in review["tags"].split(',')]
    
    location = db.get_location(loc_id)
    location["tags"] = [x.strip() for x in location["tags"].split(',')]
    return render_template('location.html', location=location, 
                                            rating=db.get_rating(loc_id),
                                            reviews=reviews,
                                            login = check_auth())

# Helper for using vscode debugger
if __name__ == "__main__":
    app.run(debug=True)
