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
      SELECT
        pins.*,
        ROUND(avg(ratings.rating), 1) AS rating
      FROM pins
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
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
