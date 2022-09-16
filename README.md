# Storefront backend Project

## Second Project of Advanced Backend Web Development Nanodegree Program with Udacity ( Egypt FWD )

### Overview:

It provides an express application serving several API endpoints for storing and accessing data, located in a postgres
database. It serves routes for users, orders and products. It uses JWT Token for authorization.

### API Reference:

Go to the `REQUIREMENTS.md` file for the API Endpoint reference and data shape documentation.

### Tech

Storefront uses a number of open source projects to work:

* [NodeJS](https://nodejs.org/en/) - Event I/O for the backend
* [ExpressJS](https://expressjs.com) - Fast, opinionated, minimalist web framework for NodeJS
* [postgresql](https://www.postgresql.org/) -PostgreSQL is a powerful, open source object-relational database system
* [JSONWebToken](https://jwt.io) - Used for authorization and authentication
* [Jasmin](https://jasmine.github.io/) - Jasmine is a behavior-driven development framework for testing JavaScript code.
* [Typescript](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on
  JavaScript, giving you better tooling at any scale.

## Required Technologies:

Your application must make use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## How to use the project:

1- clone the repo:

```
git clone https://github.com/Abdallahhany/Storefront-Backend-Project
```

2- install required dependencies :

```
npm install
```

3- add `.env` file which contain:

```
PORT=
POSTGRES_HOST=
POSTGRES_DB=
POSTGRES_TEST_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
NODE_ENV=
BCRYPT_PASSWORD=
SALT_ROUNDS=
JWT_SECRET=
```
for connecting backend with database do the following:
 - in the terminal `su postgres`
 - start psql `psql postgres`
 - in psql run the following:
   - `CREATE USER shopping_user WITH PASSWORD 'password123';`
   - `CREATE DATABASE shopping_dev;`
   - `\c shopping_dev`
   - `GRANT ALL PRIVILEGES ON DATABASE shopping_dev TO shopping_user;`
 - to create database for testing:
   - `CREATE DATABASE shopping_db_test;`
   - `GRANT ALL PRIVILEGES ON DATABASE shopping_db_test TO shopping_user;`
 - edit your .env to contain the following 
    - 
    ```
     PORT=3000
     POSTGRES_HOST=127.0.0.1 //default port of postgres is 5432
     POSTGRES_DB=shopping_dev
     POSTGRES_TEST_DB=shopping_db_test
     POSTGRES_USER=shopping_user
     POSTGRES_PASSWORD=password123
     NODE_ENV=dev
     ```
4- Run the project:

```
npm run start
```

## Scripts:

1- To Build js project:

```
npm run tsc
```

2- Start the dev server

```
npm run watch
```

3- To run tests

```
npm run tests
```
if you work on window not linux replace `export` with `set` in test script
## Author:
* [Abdallah Rashed](https://github.com/Abdallahhany)
