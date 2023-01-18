const Film = require("../models/Film");

exports.list = async (req, res) => {
  try {
    console.log(req.query)
    const message = req.query.message;
    const films = await Film.find({});
    res.render("films", { films: films, message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list films" });
  }
};

exports.add = async (req, res) => {
    try {
        await Film.create({
          Title: req.body.Title,
          Genre: req.body.Genre,
          Premiere: req.body.Premiere,
          Runtime: parseInt(req.body.Runtime),
          "IMDB Score": parseInt(req.body.IMDBScore),
          Language: req.body.Language
        })
    
        res.redirect('/films?message=film has been added')
      } catch (e) {
        if (e.errors) {
          res.render('add-film', { errors: e.errors })
          return;
        }
        return res.status(400).send({
          message: JSON.parse(e),
        });
      }
  };
  
