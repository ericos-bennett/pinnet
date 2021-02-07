/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // SELECT all users (dummy test db query)
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

  // Add pins to my wall
  // This route is triggered by both creating a new pin OR liking someone else's
  // The id here is for the signed in user
  router.post('/:user_id', (req, res) => {
    // do something
  });

  // Edit pins on my wall
  router.patch('/:user_id/pins/:pin_id', (req, res) => {
    // do something
  });

  // Delete pins on my wall
  router.delete('/:user_id/pins/:pin_id', (req, res) => {
    // do something
  });

  // Leave a comment on someone's pin
  router.post('/:user_id/pins/:pin_id/comment', (req, res) => {
    // do something
  });

  // Rate someone's pin
  router.post('/:user_id/pins/:pin_id/rating', (req, res) => {
    res.send('hmm');
  });

  return router;
};
