/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Responds with the wall cotents given the user id
  router.get('/:user_id', (req, res) => {

    const userLink = req.params.user_id;

    const queryString = `
      SELECT pins.*, count(favourites.id) AS like_count, ROUND(avg(ratings.rating), 1) AS rating
      FROM pins
      LEFT JOIN favourites
      ON pins.id = favourites.pin_id
      LEFT JOIN ratings
      ON pins.id = ratings.pin_id
      WHERE pins.user_id = $1
      GROUP BY pins.id
      ORDER BY created_at DESC;`;
    const values = [userLink];

    db.query(queryString, values)
      .then(data => {
        const pins = data.rows;
        const userId = req.cookies.userId;
        const page = "myPins";
        res.render("index", { pins, userId, page, searchTerm : null });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Adds a new topic (right now they're universal, TBD user-specific)
  router.post('/topics', (req, res) => {

    const newTopic = req.body.topic;

    console.log(newTopic);

    const queryString = `
      INSERT INTO topics (name)
      VALUES ($1)
      ON CONFLICT (name)
      DO NOTHING;
    `;
    const values = [newTopic];

    db.query(queryString, values)
      .then(() => {
        const userId = req.cookies.userId;
        res.redirect(`/users/${userId}`);
      })
      .catch(err => console.log(err));
  });

  return router;
};
