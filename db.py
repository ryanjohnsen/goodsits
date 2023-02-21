from flask import current_app
from os import environ as env
from contextlib import contextmanager
from psycopg2.extras import DictCursor
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extensions import connection, cursor

pool: ThreadedConnectionPool = None

def setup():
    global pool
    DATABASE_URL = env['DATABASE_URL']
    current_app.logger.info(f"creating db connection pool")
    pool = ThreadedConnectionPool(1, 100, dsn=DATABASE_URL, sslmode='require')

@contextmanager
def get_db_connection() -> connection:
    try:
        conn = pool.getconn()
        yield conn
    finally:
        pool.putconn(conn)

@contextmanager
def get_db_cursor(commit: bool = False) -> cursor:
    with get_db_connection() as conn:
        conn: connection
        cur = conn.cursor(cursor_factory = DictCursor)
        try:
            yield cur
            if commit:
                conn.commit()
        finally:
            cur.close()

def insert_location(title: str, description: str, hours: str, image: str, tags: str, location: str, user_id: str) -> None:
     with get_db_cursor(True) as cur:
        cur: cursor
        cur.execute(
            """
            INSERT INTO Location (title, description, hours, image, tags, location, user_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (title, description, hours, image, tags, location, user_id)
        )

def insert_review(loc_id: int, rating: str, tags: str, review: str, user_id: str) -> None:
    with get_db_cursor(True) as cur:
        cur: cursor
        cur.execute(
            "INSERT INTO Review (loc_id, rating, tags, review, user_id) VALUES (%s, %s, %s, %s, %s)", 
            (loc_id, rating, tags, review, user_id)
        )

def select_reviews(loc_id: int) -> list:
    with get_db_cursor() as cur:
        cur: cursor
        cur.execute("SELECT rating, tags, review FROM Review WHERE loc_id = %s", (loc_id))
        return cur.fetchall()
    
