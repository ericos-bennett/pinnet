const fs = require("fs");

const getRandomMax = (num) => {
  return Math.ceil(Math.random() * Math.floor(num));
};

const ratingSeed = () => {
  let ratings = [];
  let x = 0;
  while (x < 30) {
    const rating = {
      user_id: getRandomMax(6),
      pin_id: getRandomMax(30),
      rating: getRandomMax(5),
    };

    const queryString = `INSERT INTO ratings(user_id,pin_id,rating)
    VALUES(${rating.user_id}, ${rating.pin_id},${rating.rating});`;
    ratings.push(queryString);
    x++;
  }

  return ratings;
};

fs.writeFileSync("db/seeds/ratingSeeds.sql", ratingSeed());
