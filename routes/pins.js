/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Route for the search bar ('/pins?search=[query]')
  router.get('/', (req, res) => {

    const search = `%${req.query.search}%`.toLowerCase();
    const queryString = `
      SELECT pins.id AS pins_id, username, url, title, description, media, name AS topic, created_at
      FROM pins
      JOIN topics ON topic_id = topics.id
      JOIN users ON user_id = users.id
      WHERE LOWER(name) LIKE $1
        OR LOWER(title) LIKE $1
        OR LOWER(description) LIKE $1
        OR LOWER(username) LIKE $1
      ORDER BY created_at DESC;
    ;`;
    const values = [search];

    db.query(queryString, values)
      .then(data => {
        const pins = data.rows;
        res.json({ pins });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  // Add pins to my wall
  // This route is triggered by both creating a new pin OR liking someone else's
  router.post('/', (req, res) => {
    // do something
  });

  // Edit pins on my wall (if the passed user_id is it's owner)
  router.put('/:pin_id', (req, res) => {
    // do something
  });

  // Delete pins on my wall (if the passed user_id is it's owner)
  router.delete('/:pin_id', (req, res) => {
    // do something
  });

  // Leave a comment on someone's pin
  router.post('/:pin_id/comment', (req, res) => {
    // do something
  });

  // Rate someone's pin
  router.post('/:pin_id/rating', (req, res) => {
    // do something
  });

  return router;
};
