const mongoose = require("mongoose"),
      {XP} = require('../resources/constants');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  institute: { type: String, required: true },
  xp: { type: String, default: XP.BEGINNER },
  score: { type: Number, default: 0 },
  finished: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
  completion: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", userSchema);
