/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Browse all users (dummy test db query - not currently scoped)
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Responds with the wall cotents given the user id
  router.get('/:user_id', (req, res) => {
    // do something
  });

  return router;
};
