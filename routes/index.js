const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
router.use(cookieParser());

// Import all the user routes
const usersRoutes = require("./users");
const pinsRoutes = require("./pins");

module.exports = (db) => {

  // Reroute user and pins routes to their respective files
  router.use("/users", usersRoutes(db));
  router.use("/pins", pinsRoutes(db));

  // Renders the main welcome page
  router.get("/", (req, res) => {
    db.query(
      `SELECT pins.*, avg(rating) as rating
    FROM pins
    LEFT JOIN ratings ON pins.id = pin_id
    GROUP by pins.id;`
    ).then((data) => {
        const pins = data.rows;
        const userId = req.cookies.userId;
        res.render("index", { pins, userId });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Renders register page, if user is logged in, redirects to home page
  router.get('/register', (req, res) => {

    if (req.cookies.userId) {
      res.status(403).send('⚠️ You&#39;re already logged in.');
    } else {
      res.render("register", { userId : null });
    }
  });

  // Registration route to create a new user and sign them in
  // User must NOT be signed in to access this route
  router.post('/register', (req, res) => {
    if (req.cookies.userId) {
      res.status(403).send('⚠️ You&#39;re already logged in.');
    } else {
      if (req.body.username === '' ||
          req.body.email === '' ||
          req.body.password === '') {
        res.status(400).send('⚠️ Username, email and/or password cannot be empty.\nPlease try again.');
        return;
      }

      const values = [
        req.body.username,
        req.body.email,
        req.body.password,
      ];

      const queryString = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      db.query(queryString, values)
        .then(data => {
          const user = data.rows[0]; // Data is retrieved from the users table.
          res.cookie('userId', user.id);

          res.redirect('/');
        });
    }
  });

  // Route to get the login page - user must NOT be signed in to access this
  router.get("/login", (req, res) => {
    if (req.cookies.userId) {
      res.redirect("/");
    } else {
      res.render("login", { userId : null });
    }
  });

  // Sign in route - user must NOT be signed in to access this
  router.post("/login", (req, res) => {
    if (req.cookies.userId) {
      res.status(403).send('⚠️ You&#39;re already logged in.');
    } else {
      if (req.body.email === '' || req.body.password === '') {
        res.status(400).send('⚠️ Email and/or password cannot be empty.\nPlease try again.');
        return;
      }

      const values = [
        req.body.email,
        req.body.password
      ];

      const queryString = `
        SELECT id FROM users
        WHERE email = $1 AND password = $2;
      `;

      db.query(queryString, values)
        .then(data => {
          const user = data.rows[0]; // Data is retrieved from the users table.

          if (user) {
            res.cookie('userId', user.id);
            res.redirect('/');
          } else {
            res.status(400).send('⚠️ Email and/or password are wrong.\nPlease try again.');
          }
        })
        .catch((err) => {
          res.status(404).json({ error: err.message });
        });
    }
  });

  // Log out route - ser must be signed in to access
  router.post("/logout", (req, res) => {
    if (!req.cookies.userId) {
      res.status(404).send('⚠️ You cannot do that.');
    } else {
      res.clearCookie("userId");
      res.redirect("/");
    }
  });

  return router;
};
