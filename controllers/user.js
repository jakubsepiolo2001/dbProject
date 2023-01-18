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
    console.log("user id");
    console.log(user_id);
    console.log("film id");
    console.log(film_id);
    const user = await User.updateOne({_id: user_id}, {
      $push: {
        added_films: film_id
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