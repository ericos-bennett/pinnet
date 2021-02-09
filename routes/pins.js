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

    // Replace this dummy user_id with the one specified in the user's session
    // Write some code to validate that the request comes form a logged in user
    const userId = 1;
    const pinData = {...req.body, userId};

    const queryString = `
      INSERT INTO pins(user_id, topic_id, title, url, description, media)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `;
    const values = [pinData.userId, pinData.topicId, pinData.title, pinData.url, pinData.description, pinData.media];

    db.query(queryString, values)
      .then(data => {
        const newPin = data.rows[0];
        res.json({ newPin });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  // Edit pins on my wall (if the passed user_id is it's owner)
  router.put('/:pin_id', (req, res) => {

    // Replace this dummy user_id with the one specified in the user's session
    // Write some code to validate that the request comes from the user who made the pin
    const userId = 1;

    // If the request doesn't contain any of the appropriate values, redirect
    if (!(req.body.url || req.body.title || req.body.description || req.body.media || req.body.topic)) {
      res.redirect('/');

    } else {
      let queryString = `
        UPDATE pins
        SET `;

      // For each param passed, concatenate a clause
      if (req.body.url) queryString += `url = '${req.body.url}', `;
      if (req.body.title) queryString += `title = '${req.body.title}', `;
      if (req.body.description) queryString += `description = '${req.body.description}', `;
      if (req.body.media) queryString += `media = '${req.body.media}', `;

      // fix this when/if there's time, right now you can't edit the pin's topic
      // because it's asynchronous, these queries runs AFTER the main db update
      if (req.body.topic) {

        // let topicId;
        // db.query(`
        //   SELECT id FROM topics
        //   WHERE name = '${req.body.topic}';`)
        //   .then(data => {
        //     if (data.rows[0]) {
        //       topicId = data.rows[0].id;
        //     } else {

        //       // make a new record in the topics table and return its id
        //       db.query(`
        //         INSERT INTO topics (name)
        //         VALUES ('${req.body.topic}')
        //         RETURNING *;`)
        //         .then(data => {
        //           topicId = data.rows[0].id;
        //         })
        //         .catch(err => console.log(err));
        //     }
        //   })
        //   .catch(err => console.log(err))
        //   .then(console.log('topicId', topicId));

        // queryString += `topic_id = '${topicId}', `
      }

      // Remove the last comma and space
      queryString = queryString.slice(0, -2);

      // Add the WHERE specifying the record, return that record
      queryString += `
        WHERE id = '${req.params.pin_id}'
        RETURNING *;`;

      db.query(queryString)
        .then(data => {
          const updatedPin = data.rows[0];
          res.json({ updatedPin });
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  // Delete pins on my wall (if the passed user_id is it's owner)
  router.delete('/:pin_id', (req, res) => {

    // Replace this dummy user_id with the one specified in the user's session
    // Write some code to validate that the request comes from the user who made the pin
    const userId = 1;

    const pinId = req.params.pin_id;

    const queryString = `
      DELETE FROM pins
      WHERE id = $1;
    `;

    db.query(queryString, [pinId])
      .then(() => res.end())
      .catch(err => console.log(err));
  });

  // Leave a comment on someone's pin
  router.post('/:pin_id/comment', (req, res) => {

    // Replace this dummy user_id with the one specified in the user's session
    const userId = 1;

    const pinId = req.params.pin_id;
    const commentBody = req.body.commentBody;

    const queryString = `
      INSERT INTO comments (user_id, pin_id, comment_body)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [userId, pinId, commentBody];

    db.query(queryString, values)
      .then(data => {
        const newComment = data.rows[0];
        res.json(newComment);
      })
      .catch(err => console.log(err));
  });

  // Rate someone's pin
  router.post('/:pin_id/rating', (req, res) => {

    // Replace this dummy user_id with the one specified in the user's session
    const userId = 1;

    const pinId = req.params.pin_id;
    const rating = req.body.rating;

    const queryString = `
      INSERT INTO ratings (user_id, pin_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, pin_id) DO NOTHING
      RETURNING *;
    `;

    const values = [userId, pinId, rating];

    db.query(queryString, values)
      .then(data => {
        const newRating = data.rows[0];
        res.json(newRating);
      })
      .catch(err => console.log(err));

  });

  return router;
};
