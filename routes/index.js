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
    db.query(`
      SELECT
        pins.*,
        users.username AS creator,
        users.profile_picture AS creator_picture,
        ROUND(avg(ratings.rating), 1) AS rating
      FROM pins
      LEFT JOIN ratings
      ON pins.id = ratings.pin_id
      LEFT JOIN users
      ON pins.user_id = users.id
      GROUP BY pins.id, users.id
      ORDER BY created_at DESC;
    `)
      .then((data) => {
        const pins = data.rows;
        const userId = req.cookies.userId;
        const page = "explore";

        db.query(`
          SELECT pin_id, count(*) as numLikes
          FROM favourites
          GROUP BY pin_id
        `)
        .then((data) => {
          const likes = data.rows;

          res.render("index", { pins, likes, userId, page, searchTerm: null });
        })
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Renders register page, if user is logged in, redirects to home page
  router.get("/register", (req, res) => {
    if (req.cookies.userId) {
      res.status(403).send("⚠️ You&#39;re already logged in.");
    } else {
      const page = "register";
      res.render("index", { userId: null, page, searchTerm: null });
    }
  });

  // Registration route to create a new user and sign them in
  // User must NOT be signed in to access this route
  router.post("/register", (req, res) => {
    if (req.cookies.userId) {
      res.status(403).send("⚠️ You&#39;re already logged in.");
    } else {
      if (
        req.body.username === "" ||
        req.body.email === "" ||
        req.body.password === ""
      ) {
        res
          .status(400)
          .send(
            "⚠️ Username, email and/or password cannot be empty.\nPlease try again."
          );
        return;
      }

      const values = [req.body.username, req.body.email, req.body.password];

      const queryString = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      db.query(queryString, values)
        .then((data) => {
          const user = data.rows[0]; // Data is retrieved from the users table.
          res.cookie("userId", user.id);

          res.redirect("/");
        })
        .catch((err) => console.log(err));
    }
  });

  // Route to get the login page - user must NOT be signed in to access this
  router.get("/login", (req, res) => {
    if (req.cookies.userId) {
      res.redirect("/");
    } else {
      const page = "login";
      res.render("index", { userId: null, page, searchTerm: null });
    }
  });

  // Sign in route - user must NOT be signed in to access this
  router.post("/login", (req, res) => {
    if (req.cookies.userId) {
      res.status(403).send("⚠️ You&#39;re already logged in.");
    } else {
      if (req.body.email === "" || req.body.password === "") {
        res
          .status(400)
          .send("⚠️ Email and/or password cannot be empty.\nPlease try again.");
        return;
      }

      const values = [req.body.email, req.body.password];

      const queryString = `
        SELECT id FROM users
        WHERE email = $1 AND password = $2;
      `;

      db.query(queryString, values)
        .then((data) => {
          const user = data.rows[0]; // Data is retrieved from the users table.

          if (user) {
            res.cookie("userId", user.id);
            res.redirect("/");
          } else {
            res
              .status(400)
              .send("⚠️ Email and/or password are wrong.\nPlease try again.");
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
      res.status(404).send("⚠️ You cannot do that.");
    } else {
      res.clearCookie("userId");
      res.redirect("/");
    }
  });

  return router;
};
