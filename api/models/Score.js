const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema(
  {
    player_name: { type: String, require: true },
    score: { type: Number, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Score', ScoreSchema);
