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
    db.query(`SELECT * FROM pins;`)
      .then((data) => {
        const pins = data.rows;
        res.render("index", { pins: pins });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Renders register page
  // If user is logged in, redirects to home page
  router.get('/register', (req, res) => {
    res.render("register");

    // if (req.session.userId) {
    //   res.redirect('/');
    // } else {
    //   res.render("register");
    // }
  });

  // Registration route to create a new user and sign them in
  // User must NOT be signed in to access this route
  router.post('/register', (req, res) => {
    // const values = [
    //   req.body.username,
    //   req.body.email,
    //   req.body.password,
    // ];

    // console.log(values);

    // const queryString = `
    //   INSERT INTO users (username, email, password)
    //   VALUES ($1, $2, $3)
    //   RETURNING *;
    // `;

    // db.query(queryString, values)
    //   .then(res => res.rows[0])
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });

    // if (req.session.userId) {
    //   res.status(404).send('⚠️ ERROR: cannot register for an account while logged in.');
    // } else {

    // }
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
          const user = data.rows[0];

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

  // Log out route
  // User must be signed in to access this route
  router.post("/logout", (req, res) => {
    // do something...
  });

  return router;
};
