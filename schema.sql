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
    rating        TEXT,
    tags          TEXT,
    review        TEXT,
    user_id       TEXT,
    FOREIGN KEY (loc_id) REFERENCES Location(id)
);