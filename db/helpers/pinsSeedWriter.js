const faker = require("faker");
const fs = require("fs");

// created random number from 1 to num
const getRandomMax = (num) => {
  return Math.ceil(Math.random() * Math.floor(num));
};

const pinSeeds = () => {
  let pins = [];
  let x = 0;
  while (x < 30) {
    const pin = {
      user_id: getRandomMax(6),
      topic_id: getRandomMax(7),
      title: faker.name.title(),
      url: faker.image.imageUrl(),
      description: faker.lorem.sentence(),
      media: faker.image.image(),
    };

    const queryString = `INSERT INTO pins(user_id,topic_id,title,url,description,media,)VALUES(${pin.user_id},${pin.topic_id}, '${pin.title}', '${pin.url}','${pin.description}', '${pin.media}');`;

    pins.push(queryString);
    x++;
  }
  return pins;
};

fs.writeFileSync("db/seeds/pinSeeds.sql", pinSeeds());
