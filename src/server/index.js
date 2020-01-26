// To list all games and their gameId's, use
// GET https://feeds.nfl.com/feeds-rs/schedules.json

// To get team colors, retreive teams.json data from teamcolors by Jim Nielsen
// GET https://raw.githubusercontent.com/jimniels/teamcolors/master/src/teams.json

// Live Play-by-Play can be accessed at one of the following:
// GET https://feeds.nfl.com/feeds-rs/playbyplay/{{gameId}}.json
// GET http://www.nfl.com/liveupdate/game-center/{{gameId}}/{{gameId}}_gtd.json

const gameId = 2019122912;

const express = require('express');
const bodyParser = require('body-parser');
const update = require('./nfl-api/live');
const initGame = require('./db/init');

require('./db/mongoose');
const Question = require('./models/question');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("dist"));

app.get("/api/", async (req, res) => {
  try {
    console.log('> Initializing')
    Question.countDocuments({ gameId }, function(err,count){
      if(count === 0) {
        initGame(gameId);
      }
    });
    //DEBUG to force update every run
    Question.updateMany({ gameId },{finalized: false}).exec();
  
    console.log('> Updating');
    await update(gameId);
  
    console.log('> Creating output')
    const output = await Question.find({ gameId });
    res.send(output);
    console.log('> Response sent!')
  } catch (e) {
    res.status(500).send(e);
  }
  
});

app.listen(port, function() {
  console.log(`Server is running on port ${port}.`);
});
