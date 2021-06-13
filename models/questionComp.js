const mongoose = require("mongoose");

const questionCompSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sameType: { type: Number, required: true },
  mixedType: { type: Number, required: true },
});

module.exports = mongoose.model('questionComp', questionCompSchema);