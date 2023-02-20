CREATE TABLE Location (
    id            SERIAL PRIMARY KEY,
    title         TEXT,
    description   TEXT,
    hours         TEXT,
    image         TEXT,
    tags          TEXT,
    location      TEXT,
    user_id       TEXT,
);

CREATE TABLE Review (
    id            SERIAL PRIMARY KEY,
    loc_id        INTEGER,
    rating        TEXT,
    tags          TEXT,
    review        TEXT,
    user_id       INTEGER,
    FOREIGN KEY (loc_id) REFERENCES Location(id),
);