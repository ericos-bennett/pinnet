// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const morgan = require("morgan");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const app = express();

// PG database client/connection setup
const pg = require("pg");
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL || "",
  ssl: {
    rejectUnauthorized: false,
  },
});

client
  .connect()
  .catch((e) => console.log(`Error connecting to Postgres server:\n${e}`));
// Load the logger first so all (static) HTTP requests are logged to STDOUT

app.use(cookieParser());
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// All requests are rerouted to ./routes/index.js
const routes = require("./routes/index");
app.use("/", routes(client));

app.listen(PORT, () => {
  console.log(`Pinnet app listening on port ${PORT}`);
});
