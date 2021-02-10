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
        const page = "explore";
        res.render("index", { pins, userId, page, searchTerm : null });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
