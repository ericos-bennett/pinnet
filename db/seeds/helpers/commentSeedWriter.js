const faker = require("faker");
const fs = require("fs");

const getRandomMax = (num) => {
  return Math.ceil(Math.random() * Math.floor(num));
};
// Creates 6 random comment Queries and writes them to a sql file
const seedComments = () => {
  const comments = [];
  let x = 0;
  while (x <= 30) {
    const comment = {
      user_id: getRandomMax(6),
      pin_id: getRandomMax(30),
      comment_body: faker.random.words(),
    };
    const queryString = `INSERT INTO comments(user_id, pin_id, comment_body)
    Values(${comment.user_id},${comment.pin_id}, '${comment.comment_body}');`;
    comments.push(queryString);
    x++;
  }
  return comments;
};

fs.writeFileSync("db/seeds/commentSeeds.sql", seedComments());
