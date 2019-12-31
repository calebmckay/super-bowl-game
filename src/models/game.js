const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: Number,
    required: true,
    unique: true
  },
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Team'
  },
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Team'
  }
})

// gameSchema.virtual('questions', {
//   ref: 'Question',
//   localField: '_id',
//   foreignField: 'game'
// })

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;