CREATE TABLE Location (
    id            SERIAL PRIMARY KEY,
    title         TEXT,
    description   TEXT,
    hours         TEXT,
    image         BYTEA,
    tags          TEXT,
    location      POINT,
    user_id       TEXT
);

CREATE TABLE Review (
    id            SERIAL PRIMARY KEY,
    loc_id        INTEGER,
    rating        INTEGER,
    tags          TEXT,
    review        TEXT,
    user_id       TEXT,
    FOREIGN KEY (loc_id) REFERENCES Location(id)
);

INSERT INTO Review (loc_id, rating, tags, review, user_id) VALUES (%s, %s, %s, %s, %s);

INSERT INTO Location (title, description, hours, image, tags, location, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s);

SELECT rating, tags, review FROM Review WHERE loc_id = %s;

-- Query for search without tags
SELECT id, title, hours, location, tags
FROM (SELECT id, title, hours, location, tags, POINT(%s, %s) <@> location AS miles FROM Location) AS Closest 
WHERE miles >= %s AND tags LIKE %s AND .....
ORDER BY miles;
