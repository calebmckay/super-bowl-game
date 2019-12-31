const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  cityState: {
    type: String,
    required: true
  },
  nick: {
    type: String,
    required: true
  },
  abbr: {
    type: String,
    required: true
  },
  primaryColor: {
    type: String,
    required: true
  },
  secondaryColor: {
    type: String
  }
})

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;