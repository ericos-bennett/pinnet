const express = require('express');
const router  = express.Router();

// Import all the user routes
const usersRoutes = require("./users");


module.exports = (db) => {

  // Renders the main welcome page
  router.get("/", (req, res) => {
    res.render("index");
  });

  // Route for the search bar
  router.get('/search', (req, res) => {
    // do something...
  });

  // Route to get the registration page
  // If registration is on the same 'main page', we don't need this GET request and could just use the following POST for authentication
  // User must NOT be signed in to access this route
  router.get('/register', (req, res) => {
    // do something...
  });

  // Registration route to create a new user and sign them in
  // User must NOT be signed in to access this route
  router.post('/register', (req, res) => {
    // do something...
  });

  // Route to get the login page
  // If login is on the same 'main page', we don't need this GET request and could just use the following POST for authentication
  // User must NOT be signed in to access this route
  router.get('/login', (req, res) => {
    // do something...
  });

  // Sign in route
  // User must NOT be signed in to access this route
  router.post('/login', (req, res) => {
    // do something...
  });

  // Log out route
  // User must be signed in to access this route
  router.post('/logout', (req, res) => {
    // do something...
  });

  // Reroute user routes to the users.js file
  router.use("/users", usersRoutes(db));

  return router;
};
