const express = require("express");
const router = express.Router();

// Import all the user routes
const usersRoutes = require("./users");
const pinsRoutes = require("./pins");

module.exports = (db) => {
  // Reroute user and pins routes to their respective files
  router.use("/users", usersRoutes(db));
  router.use("/pins", pinsRoutes(db));

  // Renders the main welcome page
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM pins;`)
      .then((data) => {
        const pins = data.rows;
        res.render("index", { pins: pins });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Route to get the registration page
  // If registration is on the same 'main page', we don't need this GET request and could just use the following POST for authentication
  // User must NOT be signed in to access this route
  router.get("/register", (req, res) => {
    res.render("register");
  });

  // Registration route to create a new user and sign them in
  // User must NOT be signed in to access this route
  router.post("/register", (req, res) => {
    // do something...
  });

  // Route to get the login page
  // If login is on the same 'main page', we don't need this GET request and could just use the following POST for authentication
  // User must NOT be signed in to access this route
  router.get("/login", (req, res) => {
    res.render("login");
  });

  // Sign in route
  // User must NOT be signed in to access this route
  router.post("/login", (req, res) => {
    // do something...
  });

  // Log out route
  // User must be signed in to access this route
  router.post("/logout", (req, res) => {
    // do something...
  });

  return router;
};
