/* Replace with your SQL commands */
CREATE TABLE users
(
    id        SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname  VARCHAR(50) NOT NULL,
    password  VARCHAR(255) NOT NULL,
    email     VARCHAR(255) UNIQUE
);