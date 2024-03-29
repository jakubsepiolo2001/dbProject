require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const User = require('./models/User');

const userController = require("./controllers/user");
const filmController = require("./controllers/film");

const app = express();
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'topsecret', cookie: { expires: new Date(253402300000000) } }))

const { WEB_PORT, MONGODB_URI, MONGODB__PRODUCTION_URI } = process.env;

mongoose.connect(process.env.NODE_ENV === "production" ? MONGODB__PRODUCTION_URI : MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});


global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

const authMiddlewareAdmin = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  if (!user.admin) {
    return res.redirect('/');
  }
  next()
}


app.get("/", (req, res) => {
  res.render("index", { errors: {}, user : req.user });
});

app.get("/register", function (req, res) {
  res.render("register");
  });
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

app.post("/added-film-user", userController.addFilm);

app.get("/films", filmController.list);

app.get("/add-film", authMiddlewareAdmin, function (req, res) {
  res.render("add-film");
});
app.post("/add-film", filmController.add);

app.post("/remove-film", authMiddlewareAdmin, userController.removeFilmAll, filmController.remove);

app.post("/user/edit-film", authMiddleware, userController.editFilm);
app.post("/user/update-film", authMiddleware, userController.updateFilm);

app.get("/user", authMiddleware, userController.showProfile);
app.post("/user", authMiddleware, userController.removeFilm);

app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.green("✓")
  );
});
