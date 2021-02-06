const faker = require("faker");
const fs = require("fs");
const user = {
  randomEmail: `${faker.internet.email()}`,
  userPass: "password",
  randomPicture: `${faker.image.avatar()}`,
};
const users = [];

const seedUsers = () => {
  let x = 0;
  while (x <= 5) {
    const queryString = `INSERT INTO users(email, password, profile_picture)Values('${user.randomEmail}', '${user.userPass}', '${user.randomPicture}')`;
    users.push(queryString);
    x++;
  }
  return users;
};

fs.writeFileSync("db/seeds/userSeeds_2.sql", seedUsers());
seedUsers();
