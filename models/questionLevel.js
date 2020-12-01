const mongoose = require("mongoose");

const questionLevelSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  questionLevelSchema: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Question",
  },
});

module.exports = mongoose.model("QuestionLevel", questionLevelSchema);
