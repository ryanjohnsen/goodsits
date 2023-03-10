from flask import *
from typing import Callable
from functools import wraps
from os import environ as env
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from werkzeug.utils import secure_filename
from base64 import b64encode, b64decode
from collections import Counter
from io import BytesIO
from time import time
import magic
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

# Helps render page differently based of current authentication. 
def check_auth() -> dict:
    state = "logout" if session.get("user") else "login"
    return {"link": f"/{state}", "status": state.capitalize()}

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

@app.route("/")
def landing() -> Response:
    return render_template('landing.html', login = check_auth())

# Returns back a image link to a entry in the database
@app.route("/images/<int:image_id>", methods = ["GET"])
def image(image_id: int) -> Response:
    binary = db.get_image(image_id)
    if (binary == None):
        abort(404)

    image = b64decode(binary)

    mime = magic.from_buffer(image, mime = True)
    stream = BytesIO(image)

    return send_file(stream, mimetype = mime)

# Endpoint for searching the top 10 location with filtered tags in a radius
@app.route("/api/search", methods = ["GET"])
def search_api() -> Response:
    location = request.args.get("location", "0,0")
    miles = request.args.get("miles")
    tags = request.args.get("tags")
    text = request.args.get("text")
    min_rating = request.args.get("minRating")

    locations, results = db.search_locations(location, text, miles, min_rating, tags), []
    for loc in locations:
        tagFreqs = Counter(loc[5]).most_common()
        top3Tags = [tag for tag, _ in tagFreqs][:3]
        results.append({
            "id": loc[0],
            "title": loc[1],
            "hours": loc[2],
            "location": loc[3],
            "distance": loc[4],
            "tags": top3Tags,
            "rating": loc[6]
        })
    
    return jsonify(results)

# Renders the page for adding a location
@app.route("/add")
@requires_auth
def add_location() -> Response:
    return render_template('add_location.html', login = check_auth())

# The post to location endpoint that will add a location and its respective tags to the location and tag table.
# Then will proceed to redirect to the location page of the added entry
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
        image, data["location"], session["user"]["userinfo"]["sub"]
    )

    db.insert_tags(id, data["tags"])

    return redirect("/location/" + str(id))

# The page the location at loc_id resides on along with all its respective reviews
@app.route("/location/<int:loc_id>", methods = ["GET"])
def location(loc_id: int) -> Response:
    reviews = db.get_reviews(loc_id)
    location = db.get_location(loc_id)
    return render_template('location.html', location=location, 
                                            rating=db.get_rating(loc_id),
                                            reviews=reviews,
                                            login = check_auth())

@app.route("/search")
def search():
    return render_template('search.html', login = check_auth());
# Endpoint for adding fields to a location entry

@app.route("/location/<int:loc_id>/add", methods = ["POST"])
@requires_auth
def add_review(loc_id: int) -> Response:
    rating = request.form.get("starRating")
    tags = request.form.get("tags")
    review = request.form.get("review")
    user_id = session["user"]["userinfo"]["sub"]

    if loc_id == None or rating == None or tags == None or review == None or user_id == None:
        return make_response("Review Not Inserted", 400)
    
    review_id = db.insert_review(int(loc_id), int(rating), review, user_id)
    db.insert_tags(loc_id, tags, review_id)

    return redirect("/location/"+str(loc_id))
    


# Helper for using vscode debugger
if __name__ == "__main__":
    app.run(debug=True)
