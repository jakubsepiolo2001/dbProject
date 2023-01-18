const User = require('../models/User');
const bcrypt = require('bcrypt');

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

  