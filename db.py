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
    pool = ThreadedConnectionPool(1, 5, dsn=DATABASE_URL, sslmode='require')

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

def search_locations(location: str, miles: int, tags: str) -> list:
    lat, long = location.split(',')
    args = [lat, long]
    tags = tags.split(',') if tags else []

    query = """
        WITH nearby AS (
            SELECT l.id, l.title, l.hours, l.location, POINT(%s, %s) <@> l.location AS miles
            FROM Location AS l
            WHERE
    """.rstrip()
    

    if tags:
        query += " ARRAY["
        for i in range(len(tags) - 1):
            query += "%s, "
            args.append(tags[i])
        query += """
            %s] <@ ARRAY (
                SELECT t.title
                FROM Tag AS t
                WHERE loc_id = l.id
                GROUP BY t.title
                ORDER BY COUNT(t.title) DESC
                LIMIT 3
            ) AND
        """.strip()
        args.append(tags[len(tags) - 1])
    
    # No two points on earth are greater than 10,000 miles
    query += " (POINT(%s, %s) <@> location <= COALESCE(%s, 10000) OR location IS NULL)"
    args.append(lat)
    args.append(long)
    args.append(miles)

    query += """
        )

        SELECT nearby.id, nearby.title, nearby.hours, nearby.location, t.tags
        FROM nearby LEFT JOIN (
            SELECT n.id, array_agg(DISTINCT t.title) AS Tags
            FROM nearby AS n, Tag AS t
            WHERE n.id = t.loc_id
            GROUP BY n.id
        ) AS t ON nearby.id = t.id
        ORDER BY miles ASC
        LIMIT 10
    """

    with get_db_cursor() as cur:
        cur: cursor
        cur.execute(query, args) 
        return cur.fetchall()
    
def get_image(id: int) -> bytes:
    with get_db_cursor() as cur:
        cur: cursor
        cur.execute("SELECT image FROM Location WHERE id = %s", (id,)) 
        return cur.fetchone()[0]

def insert_location(title: str, description: str, hours: str, image: str, location: str, user_id: str) -> int:
     lat, long = location.split(',')
     with get_db_cursor(True) as cur:
        cur: cursor
        cur.execute(
            """
            INSERT INTO Location (title, description, hours, image, location, user_id)
            VALUES (%s, %s, %s, %s, POINT(%s, %s), %s)
            RETURNING id
            """, (title, description, hours, image, lat, long, user_id)
        )
        return int(cur.fetchone()[0])

def insert_tags(loc_id: int, tags: str, review_id: int = None) -> None:
    if tags == None or len(tags) == 0:
        return
    
    args = []
    tags = tags.split(',')

    query = """
        INSERT INTO Tag (loc_id, review_id, title)
        VALUES
    """.rstrip()
    
    for i in range(len(tags) - 1):
        query += " (%s, %s, %s),"
        args.append(loc_id)
        args.append(review_id)
        args.append(tags[i])
    
    query += " (%s, %s, %s)"
    args.append(loc_id)
    args.append(review_id)
    args.append(tags[len(tags) - 1])

    with get_db_cursor(True) as cur:
        cur: cursor
        cur.execute(query, args)

def insert_review(loc_id: int, rating: str, review: str, user_id: str) -> int:
    with get_db_cursor(True) as cur:
        cur: cursor
        cur.execute(
            """
            INSERT INTO Review (loc_id, rating, review, user_id) 
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """, (loc_id, rating, review, user_id)
        )
        return int(cur.fetchone()[0])
    
def get_reviews(loc_id: int) -> list:
    with get_db_cursor() as cur:
        cur: cursor
        cur.execute(
            """
            SELECT r.id, r.rating, r.review, array_agg(DISTINCT t.title) AS tags
            FROM Review AS r, Tag AS t
            WHERE r.loc_id = t.loc_id AND r.loc_id = %s
            GROUP BY r.id
            """, (loc_id,)
        )
        return cur.fetchall()
    
def get_location(loc_id: int) -> dict:
    with get_db_cursor() as cur:
        cur: cursor
        cur.execute(
            """
            SELECT l.id, l.title, l.description, l.hours, l.location, l.user_id, array_agg(DISTINCT t.title) AS tags
            FROM Location AS l, Tag AS t
            WHERE l.id = t.loc_id AND l.id = %s
            GROUP BY l.id;
            """, (loc_id,)
        )
        return cur.fetchone()
    
def get_rating(loc_id: int) -> float:
    with get_db_cursor() as cur:
        cur: cursor
        cur.execute("SELECT COALESCE(AVG(rating), 0.0) FROM Review WHERE loc_id = %s", (loc_id,))
        return float(cur.fetchone()[0])
    
