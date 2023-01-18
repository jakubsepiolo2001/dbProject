const mongoose = require("mongoose");
const { Schema } = mongoose;

const filmSchema = new Schema(
  {
    Title: String,
    Genre: String,
    Premiere: String,
    Runtime: Number,
    "IMDB Score": Number,
    Language: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Film", filmSchema);
