const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  game: {
    // Linked game
    type: mongoose.Schema.Types.ObjectId,
    // TODO: Fix game linking and uncomment this line
    //required: true,
    ref: 'Game'
  },
  gameId: {
    // TODO: temporary until game linking is complete
    type: String,
    required: true
  },
  questionId: {
    // Id number of question
    type: Number, 
    required: true
  },
  yesno: {
    // Is this a Yes/No question?
    type: Boolean,
    required: true
  },
  teamValues: {
    // Does this question have numbers for each team that should be compared? (e.g. Yards per team)
    type: Boolean,
    required: true
  },
  shortName: {
    // Short name of question
    type: String,
    required: true
  },
  longName: {
    // Full question
    type: String,
    required: true
  },
  homeVal: {
    // If teamValues is true, the value for the home team
    type: String
  },
  awayVal: {
    // If teamValues is true, the value for the away team
    type: String
  },
  value: {
    // For yes/no 1=yes, 0=no. For team questions 1=home, -1=away, 0=tie
    type: Number,
    required: true,
    default: 0
  },
  finalized: {
    // This question's final result has been determined (usually for yes/no questions)
    type: Boolean,
    default: false
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;