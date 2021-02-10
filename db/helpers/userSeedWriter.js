const faker = require("faker");
const fs = require("fs");

// Creates 6 random user Queries and writes them to a sql file
const seedUsers = () => {
  const users = [];
  let x = 0;
  while (x <= 5) {
    const user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      Password: "password",
      picture: faker.image.avatar(),
    };
    const queryString = `INSERT INTO users(username, email, password, profile_picture)
    Values('${user.username}', '${user.email}', '${user.password}', '${user.picture}');`;
    users.push(queryString);
    x++;
  }
  return users;
};

fs.writeFileSync("db/seeds/userSeeds.sql", seedUsers());
