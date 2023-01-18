require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const User = require('./models/User');




/**
 * Controllers (route handlers).
 
const tasterController = require("./controllers/taster");
const userController = require("./controllers/user");
const tastingController = require("./controllers/tasting");
const homeController = require("./controllers/home");
*/
const userController = require("./controllers/user");
const filmController = require("./controllers/film");

const app = express();
app.set("view engine", "ejs");

app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))



global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})


/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { WEB_PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get("/", (req, res) => {
  res.render("index", { errors: {}, user : req.user });
});

// Showing register form
app.get("/register", function (req, res) {
  res.render("register");
  });

// Handling user signup
app.post('/register', userController.create);

app.get("/login", function (req, res) {
  res.render("login");
  });

app.post('/login', userController.login);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

app.get("/films", filmController.list);

app.get("/add-film", function (req, res) {
  res.render("add-film");
});

app.post("/add-film", filmController.add);

app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});
