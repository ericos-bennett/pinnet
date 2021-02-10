const faker = require("faker");
const fs = require("fs");

const getRandomMax = (num) => {
  return Math.ceil(Math.random() * Math.floor(num));
};
// Creates 6 random favourite Queries and writes them to a sql file
const seedFavourites = () => {
  const favourites = [];
  let x = 0;
  while (x <= 30) {
    const favourite = {
      user_id: getRandomMax(6),
      pin_id: getRandomMax(30),
      is_liked: true,
    };
    const queryString = `INSERT INTO favourites(user_id, pin_id, is_liked)
    Values(${favourite.user_id},${favourite.pin_id}, ${favourite.is_liked});`;
    favourites.push(queryString);
    x++;
  }
  return favourites;
};

fs.writeFileSync("db/seeds/favouriteSeeds.sql", seedFavourites());
