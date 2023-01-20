const Film = require("../models/Film");

exports.list = async (req, res) => {
  try {
    const films = await Film.find({}).sort({"IMDB Score": -1});
    res.render("films", {films: films});
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
          "IMDB Score": Number(req.body.IMDBScore),
          Language: req.body.Language
        })
    
        res.redirect('/films?message=film has been added')
      } catch (e) {
        if (e.errors) {
          console.log(e);
          res.render('add-film', { errors: e.errors })
          return;
        }
        return res.status(400).send({
          message: JSON.parse(e),
        });
      }
  };
  
  exports.remove = async (req, res) => {
    try {
      const film_id = req.body.id;
      const films = await Film.deleteOne({_id: film_id});
      res.redirect('films');
    } catch (e) {
      res.status(404).send({ message: "could not list films" });
    }
  };