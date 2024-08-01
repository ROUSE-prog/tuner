CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    album VARCHAR(100),
    time VARCHAR(10),
    is_favorite BOOLEAN
);
