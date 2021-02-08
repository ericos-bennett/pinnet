/*
 * All routes for Users are defined here
 * These routes are mounted onto /users
*/

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Route for the search bar ('/pins')
  router.get('/', (req, res) => {
    // do something...
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
