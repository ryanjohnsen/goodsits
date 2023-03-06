CREATE TABLE Location (
    id            SERIAL PRIMARY KEY,
    title         TEXT,
    description   TEXT,
    hours         TEXT,
    image         BYTEA,
    location      POINT,
    user_id       TEXT
);

-- "Scuttle" solution
CREATE TABLE Tag (
    id            SERIAL PRIMARY KEY,
    loc_id        INTEGER NOT NULL,
    review_id     INTEGER,
    title         TEXT NOT NULL,
    FOREIGN KEY (loc_id) REFERENCES Location(id),
    FOREIGN KEY (review_id) REFERENCES Review(id)
);

CREATE TABLE Review (
    id            SERIAL PRIMARY KEY,
    loc_id        INTEGER,
    rating        INTEGER,
    review        TEXT,
    user_id       TEXT,
    FOREIGN KEY (loc_id) REFERENCES Location(id)
);

-- Query for getting byte representation of image
SELECT image FROM Location WHERE id = %s;

-- Query for inserting location entry into Location table
INSERT INTO Location (title, description, hours, image, location, user_id)
VALUES (%s, %s, %s, %s, POINT(%s, %s), %s)
RETURNING id;

--- Query for inserting review entry into Review table
INSERT INTO Review (loc_id, rating, review, user_id) 
VALUES (%s, %s, %s, %s)
RETURNING id;

--- Query for inserting tags into Tag table (could be from a review or location entry)
INSERT INTO Tag (loc_id, review_id, title)
VALUES (%s, %s, %s), (%s, %s, %s), ...;

-- Query for search
WITH nearby AS (
    SELECT l.id, l.title, l.hours, l.image, l.location, POINT(%s, %s) <@> l.location AS miles
    FROM Location AS l
    WHERE ARRAY[%s, %s, ..., %s] <@ ARRAY(
        SELECT t.title
        FROM Tag AS t
        WHERE loc_id = l.id
        GROUP BY t.title
        ORDER BY COUNT(t.title) DESC
        LIMIT 3
    )
    AND l.title LIKE '%%s%'
    AND (POINT(%s, %s) <@> location <= %s OR location IS NULL)
)

SELECT nearby.*, t.tags, r.avg_rating
FROM nearby LEFT JOIN (
    SELECT n.id, array_agg(DISTINCT t.title) AS tags
    FROM nearby AS n, Tag AS T
    WHERE n.id = t.loc_id
    GROUP BY n.id
) AS t ON nearby.id = t.id LEFT JOIN (
    SELECT n.id, COALESCE(AVG(r.rating), 0.0) AS avg_rating
    FROM nearby AS n, Review AS r
    WHERE n.id = r.loc_id
    GROUP BY n.id
) AS r ON nearby.id = r.id
ORDER BY miles ASC
WHERE (r.avg_rating IS NULL OR r.avg_rating > %s)
LIMIT 10;

-- Example
WITH nearby AS (
    SELECT l.id, l.title, l.hours, l.location, POINT(0, 0) <@> l.location AS miles
    FROM Location AS l
    WHERE ARRAY['quiet', 'computer'] <@ ARRAY(
        SELECT t.title
        FROM Tag t
        WHERE loc_id = l.id
        GROUP BY t.title
        ORDER BY COUNT(t.title) DESC
        LIMIT 3
    )
    AND l.title LIKE '%el%'
    AND (POINT(0, 0) <@> location >= 10 OR location IS NULL)
)

SELECT nearby.*, t.tags, r.avg_rating
FROM nearby LEFT JOIN (
    SELECT n.id, array_agg(DISTINCT t.title) AS tags
    FROM nearby AS n, Tag AS T
    WHERE n.id = t.loc_id
    GROUP BY n.id
) AS t ON nearby.id = t.id LEFT JOIN (
    SELECT n.id, COALESCE(AVG(r.rating), 0.0) AS avg_rating
    FROM nearby AS n, Review AS r
    WHERE n.id = r.loc_id
    GROUP BY n.id
) AS r ON nearby.id = r.id
WHERE r.avg_rating > 2
ORDER BY miles
LIMIT 10;

-- Query for getting tags
SELECT r.id, r.rating, r.review, array_agg(DISTINCT t.title) AS tags
FROM Review AS r, Tag AS t
WHERE r.loc_id = t.loc_id AND r.loc_id = %s
GROUP BY r.id;

-- Example
SELECT r.id, r.rating, r.review, array_agg(DISTINCT t.title) AS tags
FROM Review AS r, Tag AS t
WHERE r.loc_id = t.loc_id AND r.loc_id = 2
GROUP BY r.id;

-- Query for getting single location
SELECT l.id, l.title, l.description, l.hours, l.location, l.user_id, array_agg(DISTINCT t.title) AS tags
FROM Location AS l, Tag AS t
WHERE l.id = t.loc_id AND l.id = %s
GROUP BY l.id;

-- Example
SELECT l.id, l.title, l.description, l.hours, l.location, l.user_id, array_agg(DISTINCT t.title) AS tags
FROM Location AS l, Tag AS t
WHERE l.id = t.loc_id AND l.id = 2
GROUP BY l.id;

-- Query for getting average rating from all reviews given location id
SELECT COALESCE(AVG(rating), 0.0) FROM Review WHERE loc_id = %s;