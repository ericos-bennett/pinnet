/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Responds with the wall cotents given the user id
  router.get('/:user_id', (req, res) => {

    db.query(`SELECT * FROM pins
              WHERE user_id = ${req.params.user_id};`)
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

  return router;
};
