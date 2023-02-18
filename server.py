from flask import *
from typing import Callable
from functools import wraps
from os import environ as env
from db_scripts import FlyWheeler
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
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
            return redirect('/login')
        return func(*args, **kwargs)
    return decorator

@app.route("/") #TODO Change this to index.
def landing():
    return render_template('landing.html')

@app.route("/add")
@requires_auth
def add_location():
    return render_template('add_location.html')

@app.route("/login", methods = ["GET"])
def login() -> Response:
    return oauth.auth0.authorize_redirect(
        redirect_uri = url_for("callback", _external = True)
    )

@app.route("/callback", methods = ["GET", "POST"])
# Has to be a better way to stop this endpoint from being directly accessed by the user?
def callback() -> Response:
    try:
        token = oauth.auth0.authorize_access_token()
        session["user"] = token # might only want to save part of this
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