const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  inputs: { type: String, required: true },
  outputs: { type: String, required: true },
  difficulty: { type: String, required: true },
  level: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model("Question", questionSchema);
