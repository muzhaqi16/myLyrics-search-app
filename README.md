<!-- # book-thing.io

Initial wireframes:

https://wireframe.cc/x0a8I9

https://wireframe.cc/6oVXTU -->
# Book-Thing.IO

A community driven, book recommendation application. Users can create lists of their favorite books and have others recommended to them.

## Motivation

We wanted a book recommendation app that was community driven. Books and lists are all created by the users.

## Build Status

![Build Status](https://travis-ci.org/thinkful-c11/book-thing.io.svg?branch=master)

## Screenshots
Login Screen/Landing Page:

![login screen](screenshots/login.png)

About:

![about](screenshots/about.png)

Library:

![library](screenshots/library.png)

Recommendations:

![recommendations](screenshots/recommendations.png)

## Environment Setup

1. Setup your own postgress server
2. Run the database_script.sql file to build your table structure
3. Create a .env file in your server folder which contains the path to your database as well as your client id and secret
4. Obtain a client id and secret by setting up your app with [the google developers console](https://console.developers.google.com/)
5. Run your project with
```
npm run dev
```

## Running the tests

To run all tests, run
```
npm test
```
To run just the front/back end tests, run
```
npm run test:server

npm run test:client
```

## Built With

### Front-End
* React
* Redux
* React-Router

### Back-End
* Postgress
* Express
* Node
* Knex

### Testing
* Mocha
* Chai
* Chai-http
* Jest

## Features

* Create a list of books
* Add your favorite books
* Like lists to get recommendations
* See every book currently in the library

## Demo

- [Live Demo](https://book-thing.herokuapp.com/)

## Authors

* **Sonja Duric** - ** - Database design/Back-End development
* **Jonathan Fitzgibbon** - ** - Back-End development/testing
* **Tanner Gill** - ** - Front-End development/testing, styling
* **Patrice White** - ** - Front-End development/testing, styling

## Acknowledgments

* **Ben Pardo** - ** - The Great Savior, The Wise Sage

