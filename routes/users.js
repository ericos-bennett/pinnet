/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Responds with the wall cotents given the user id
  router.get('/:user_id', (req, res) => {

    const topicId = req.query.topicId;
    const userLink = req.params.user_id;

    let queryString = `
      SELECT
        pins.*,
        ROUND(avg(ratings.rating), 1) AS rating
      FROM pins
      LEFT JOIN ratings
      ON pins.id = ratings.pin_id
      LEFT JOIN topics
      ON topic_id = topics.id
      WHERE pins.user_id = $1`;

    if (topicId) {
      queryString += ` AND topics.id = ${topicId} `;
    }

    queryString +=
      `GROUP BY pins.id
      ORDER BY created_at DESC;`;

    const values = [userLink];

    db.query(queryString, values)
      .then(data => {

        const pins = data.rows;
        const userId = req.cookies.userId;

        // Get array of topics
        db.query(`SELECT * FROM topics;`)
          .then(topicData => {

            let topics = [];
            for (let topic of topicData.rows) {
              topics.push(topic);
            }

            db.query(`
              SELECT pin_id, count(*) as numLikes
              FROM favourites
              GROUP BY pin_id
            `)
              .then((data) => {
                const likes = data.rows;
                const page = "myPins";

                res.render("index", { pins, topics, likes, userId, page, searchTerm : null });
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  });

  // Adds a new topic (right now they're universal, TBD user-specific)
  router.post('/topics', (req, res) => {

    const newTopic = req.body.topic;

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
