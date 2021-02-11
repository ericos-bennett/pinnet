/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Route for the search bar ('/pins?search=[query]') - case insensitive
  router.get("/", (req, res) => {
    const search = `%${req.query.search}%`.toLowerCase();
    const queryString = `
      SELECT
        pins.*,
        users.username AS creator,
        users.profile_picture AS creator_picture,
        COUNT(favourites.id) AS like_count,
        ROUND(avg(ratings.rating), 1) AS rating
      FROM pins
      LEFT JOIN favourites
      ON pins.id = favourites.pin_id
      LEFT JOIN ratings
      ON pins.id = ratings.pin_id
      LEFT JOIN users
      ON pins.user_id = users.id
      WHERE LOWER(title) LIKE $1
        OR LOWER(description) LIKE $1
      GROUP BY pins.id, users.id
      ORDER BY created_at DESC;
    ;`;
    const values = [search];

    db.query(queryString, values)
      .then((data) => {
        const pins = data.rows;
        const userId = req.cookies.userId;
        const page = "explore";
        const searchTerm = search.substring(1, search.length - 1);
        res.render("index", { pins, userId, page, searchTerm });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Add pins to my wall via the create form
  router.post("/", (req, res) => {
    const userId = req.cookies.userId;

    // const userId = req.cookies.userId;
    const pinData = { ...req.body, userId };

    // Only send the query if all required values are truthy
    if (pinData.userId && pinData.title && pinData.url && pinData.media) {
      const queryString = `
      INSERT INTO pins(user_id, title, url, description, media)
      VALUES($1, $2, $3, $4, $5);
      `;
      const values = [
        pinData.userId,
        pinData.title,
        pinData.url,
        pinData.description,
        pinData.media,
      ];

      db.query(queryString, values)
        .then(() => {
          res.redirect(`/users/${userId}`);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.end();
    }
  });

  // Add pins to my wall by liking someone else's
  router.post("/:pin_id/like", (req, res) => {
    const userId = req.cookies.userId;
    const pinId = req.params.pin_id;

    // Only run the query if a user is signed in
    if (userId) {
      const queryString = `
        INSERT INTO pins (user_id, title, url, description, media)
        SELECT $1, title, url, description, media
        FROM pins
        WHERE id = $2
        ON CONFLICT (user_id, url) DO NOTHING
        RETURNING *;
      `;
      const values = [userId, pinId];

      db.query(queryString, values)
        .then(() => {
          const queryString = `
            INSERT INTO favourites (user_id, pin_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, pin_id) DO NOTHING
            RETURNING pin_id;
          `;
          const values = [userId, pinId];

          db.query(queryString, values)
            .then(() => res.end())
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      res.end();
    }
  });

  // Edit pins on my wall (if the userId cookie is it's owner's user_id)
  router.put("/:pin_id", (req, res) => {
    const userId = req.cookies.userId;

    let queryString = `
        UPDATE pins
        SET `;

    // For each param passed, concatenate a clause
    if (req.body.url) queryString += `url = '${req.body.url}', `;
    if (req.body.title) queryString += `title = '${req.body.title}', `;
    if (req.body.description)
      queryString += `description = '${req.body.description}', `;
    if (req.body.media) queryString += `media = '${req.body.media}', `;

    // Remove the last comma and space
    queryString = queryString.slice(0, -2);

    // Add the WHERE specifying the record, return that record
    queryString += `
        WHERE id = '${req.params.pin_id}' AND user_id = ${userId}
        RETURNING *;`;

    db.query(queryString)
      .then((data) => {
        const updatedPin = data.rows[0];
        res.redirect("back");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Delete a pin on my wall (if the userId cookie is it's owner's user_id)
  router.delete("/:pin_id", (req, res) => {
    const pinId = req.params.pin_id;
    const userId = req.cookies.userId;

    const queryString = `
      DELETE FROM pins
      WHERE id = $1 AND user_id = $2;
    `;
    const values = [pinId, userId];

    db.query(queryString, values)
      .then(() => res.redirect("back"))
      .catch((err) => console.log(err));
  });

  // Leave a comment on someone's pin
  router.post("/:pin_id/comment", (req, res) => {
    const userId = req.cookies.userId;
    const pinId = req.params.pin_id;
    const commentBody = req.body.commentBody;

    // Only send the query if all values are truthy
    if (userId && pinId && commentBody) {
      const queryString = `
        INSERT INTO comments (user_id, pin_id, comment_body)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [userId, pinId, commentBody];

      db.query(queryString, values)
        .then((data) => {
          const newComment = data.rows[0];
          res.json(newComment);
        })
        .catch((err) => console.log(err));
    } else {
      res.end();
    }
  });

  // Rate someone's pin (only one rating user/pin pair allowed)
  router.post("/:pin_id/rating", (req, res) => {
    const userId = req.cookies.userId;
    const pinId = req.params.pin_id;
    const rating = req.body.rating;

    // Only send the query if all values are truthy
    if (userId && pinId && rating) {
      const queryString = `
      INSERT INTO ratings (user_id, pin_id, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, pin_id) DO NOTHING
      RETURNING *;
    `;
      const values = [userId, pinId, rating];

      db.query(queryString, values)
        .then((data) => {
          const newRating = data.rows[0];
          res.json(newRating);
        })
        .catch((err) => console.log(err));
    } else {
      res.end();
    }
  });

  // Add a topic to a pin
  router.post("/:pin_id/topic", (req, res) => {

    console.log(req.body);

    const topicId = req.body.topicId;
    const pinId = req.params.pin_id;
    const userId = req.cookies.userId;

    // Update the pin with its new topic
    const queryString = `
          UPDATE pins
          SET topic_id = $1
          WHERE id = $2 AND user_id = $3;
          `;
    const values = [topicId, pinId, userId];

    db.query(queryString, values)
      .then(() => {
        res.end();
      })
      .catch((err) => console.log(err));
  });

  return router;
};
