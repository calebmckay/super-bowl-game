// Library imports
const axios = require('axios');

// Models
const Question = require('../models/question');

// Utils
const evalFunctions = require('./eval');

saveUpdate = async (id, updates) => {
  const question = await Question.findOne({ questionId: id });
  const keys = Object.keys(updates);
  keys.forEach((key) => question[key] = updates[key]);
  await question.save();
}

update = async (gameId) => {
  const url = `http://www.nfl.com/liveupdate/game-center/${gameId}/${gameId}_gtd.json`
  try {
    const request = await axios.get(url, { responseType: 'json' });
    const data = request.data[gameId];
    // TODO: Change this to be a forEach loop for all Questions linked to this gameId, rather
    // than an index of question id's
    for (let id = 1; id <= 30; id++) {
      // Use the matching evalFunction to evaluate any updates needed for the database
      const updates = evalFunctions[`q${id}`](data);
      if (updates !== null) {
        await saveUpdate(id, updates);
      }
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = update;