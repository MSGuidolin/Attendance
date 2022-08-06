CREATE DATABASE database_movies;

USE database_movies;

-- USERS TABLE
CREATE TABLE users(
    id INT(20) NOT NULL AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

DESCRIBE users;

-- GENRES TABLE
CREATE TABLE genres(
    id INT(11) NOT NULL AUTO_INCREMENT,
    genre VARCHAR(20)  NOT NULL UNIQUE,
    user_id INT(11) NOT NULL,
    description TEXT NOT NULL,
    mini_desc TEXT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

DESCRIBE genres;

-- MOVIES TABLE
CREATE TABLE movies(
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(40) NOT NULL,
    director VARCHAR(20) NOT NULL,
    genre INT(11) NOT NULL,
    synopsis TEXT,
    user_id INT(11) NOT NULL,
    created_at timestamp NOT NULL default current_timestamp,
    PRIMARY KEY (id),
    CONSTRAINT fk_genre FOREIGN KEY (genre) REFERENCES genres(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

DESCRIBE movies;