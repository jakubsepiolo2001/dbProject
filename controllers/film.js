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
