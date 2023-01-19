const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

exports.create = async (req, res) => {
    
  try {
    const user = new User({ username: req.body.username, password: req.body.password});
    await user.save();
    res.redirect('/?message=user created')
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
            res.render('login', { errors: { username: { message: 'username not found' } } })
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        
        if (match) {
            req.session.userID = user._id;
            console.log(req.session.userID);
            res.redirect('/');
            console.log('authenticated')
            return
        }

        res.render('login', { errors: { password: { message: 'password does not match' } } })


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
    console.log("adding film");
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
      console.log(req.query)
      const user_id = global.user.id;
      const films = await User.findById(user_id, {added_films: 1, _id: 0});
      console.log(films.added_films);
      console.log(films.added_films[0]);
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
    console.log("removing single film");
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
    console.log("removefilmall");
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