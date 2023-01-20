const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
    
  try {
    const user_exists = await User.findOne({ username: req.body.username });
    if(user_exists){res.redirect('/register?message=Username already taken')};
    const user = new User({ username: req.body.username, password: req.body.password});
    await user.save();
    res.redirect('/?message=User successfully created')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('register', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.render('login', { errors: { username: { message: 'Invalid Credentials' } } })
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        
        if (match) {
            req.session.userID = user._id;
            res.redirect('/');
            return
        }

        res.render('login', { errors: { password: { message: 'Invalid Credentials' } } })


    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.addFilm = async (req, res) => {
    
  try {
    const user_id = global.user._id;
    const film_id = mongoose.Types.ObjectId(req.body.id);
    const film_title = req.body.title;
    const user = await User.updateOne({_id: user_id}, {
      $push: {
        added_films: {film_id: film_id, Title: film_title, Watched: false, User_rating: "N/A"}
      }
    });
    res.redirect("/?message=added_film_to_user");
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('/?message=failed_adding_film_to_user', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.showProfile = async (req, res) => {

    try {
      const user_id = global.user.id;
      const films = await User.findById(user_id, {added_films: 1, _id: 0});
      res.render("user", { films: films.added_films});
    } catch (e) {
      console.log(e)
      res.status(404).send({ message: "could not list user's films" });
    }
};

exports.removeFilm = async (req, res) => {
  try{
    const user_id = global.user.id;
    const film_id = mongoose.Types.ObjectId(req.body.id);
    const user = await User.updateOne({_id: user_id},
      {"$pull": {
        added_films : {
          film_id: film_id
        }
      }
      });
    res.redirect("/user");
  } catch (e){
    console.log(e)
    res.status(404).send({ message: "could not remove film" });
  }
};

exports.removeFilmAll = async (req, res, next) => {
  try{
    const film_id = mongoose.Types.ObjectId(req.body.id);
    const user = await User.updateMany({},
      {"$pull": {
        added_films : {
          film_id: film_id
        }
      }
      });
    next();
  } catch (e){
    console.log(e)
    res.status(404).send({ message: "could not remove film" });
  }
};

exports.editFilm = async (req, res, next) => {
  try{
    const user_id = global.user.id;
    const film_id = mongoose.Types.ObjectId(req.body.id);
    const film = await User.find({_id: user_id, "added_films.film_id": film_id}, {_id: 0, admin: 0, added_films: {$elemMatch: {film_id: film_id}}});
    const edit_film = film[0].added_films;
    res.render("update-user-film", { film: edit_film});
  } catch (e){
    console.log(e)
    res.status(404).send({ message: "could not remove film" });
  }
};

exports.updateFilm = async (req, res, next) => {
  try{
    const user_id = global.user.id;
    const film_id = mongoose.Types.ObjectId(req.body.id);
    const watched = (req.body.watched == "Yes");
    const user_rating = Number(req.body.user_rating);
    const film = await User.updateOne({_id : user_id, "added_films.film_id": film_id} , {$set: {"added_films.$.Watched": watched, "added_films.$.User_rating": user_rating}})
    res.redirect("/user");
  } catch (e){
    console.log(e)
    res.status(404).send({ message: "could not remove film" });
  }
};

