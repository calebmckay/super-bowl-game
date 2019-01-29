//jshint esversion:6

const GAMEID = 2019012001;
var homeTeam, awayTeam;

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require("request");
const update = require("./update.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/superBowlDB", {useNewUrlParser: true});

const categorySchema = {
  id: Number, // Id number of category
  yesno: Boolean, // Is this a Yes/No question?
  teamValues: Boolean, // Does this question have numbers for each team that should be compared? (e.g. Yards per team)
  shortName: String, // Short name of question
  longName: String, // Full question
  homeVal: String, // If teamValues is true, the value for the home team
  awayVal: String, // If teamValues is true, the value for the away team
  value: Number, // For yes/no 1=yes, 0=no. For team questions 1=home, 2=away, 0=tie
  finalized: Boolean // This question's final result has been determined (usually for yes/no questions)
};

const Category = mongoose.model("Category", categorySchema);

function initCategories(){
  Category.remove({});
  const categoryList = [];
  categoryList.push(new Category({id: 1, yesno: false, teamValues: false, shortName: "Win the Game", longName: "Which team will win the game?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 2, yesno: false, teamValues: false, shortName: "Coin Toss", longName: "Which team will win the coin toss?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 3, yesno: false, teamValues: false, shortName: "First Score", longName: "Which team will score first?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 4, yesno: false, teamValues: true, shortName: "First Downs", longName: "Which team will have more first downs?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 5, yesno: false, teamValues: true, shortName: "Total Yards", longName: "Which team will have more total yards?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 6, yesno: false, teamValues: true, shortName: "Passing Yards", longName: "Which team will have more passing yards?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 7, yesno: false, teamValues: true, shortName: "Rushing Yards", longName: "Which team will have more rushing yards?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 8, yesno: false, teamValues: true, shortName: "Pass Completion", longName: "Which team will have a higher pass completion percentage?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 9, yesno: false, teamValues: true, shortName: "Touchdowns", longName: "Which team will have more touchdowns?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 10, yesno: false, teamValues: true, shortName: "Field Goals", longName: "Which team will have more field goals?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 11, yesno: false, teamValues: true, shortName: "Sacks", longName: "Which team will have more sacks?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 12, yesno: false, teamValues: true, shortName: "Turnovers", longName: "Which team will have more turnovers?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 13, yesno: false, teamValues: true, shortName: "Penalties", longName: "Which team will have more penalties?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 14, yesno: false, teamValues: true, shortName: "Penalty Yards", longName: "Which team will have more penalty yards?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 15, yesno: false, teamValues: true, shortName: "Time of Possession", longName: "Which team will have a longer time of possession?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 16, yesno: false, teamValues: false, shortName: "Last Score", longName: "Which team will score last?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 17, yesno: false, teamValues: true, shortName: "Longest Field Goal", longName: "Which team will have the longest field goal in yards?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 18, yesno: true, teamValues: false, shortName: "Coin Lands Heads", longName: "Will the coin toss be \"Heads\"?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 29, yesno: true, teamValues: false, shortName: "Score in 7 Minutes", longName: "Will a team score in the first 7 minutes of the game?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 20, yesno: true, teamValues: false, shortName: "Missed FG or XP", longName: "Will there be a missed FG or extra point attempt?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 21, yesno: true, teamValues: false, shortName: "Kick Returned for TD", longName: "Will there be a kick or punt returned for a touchdown?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 22, yesno: true, teamValues: false, shortName: "Defensive TD", longName: "Will there be a Defensive Touchdown (either team)?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 23, yesno: true, teamValues: false, shortName: "45+ Yard FG", longName: "Will there be a successful field goal longer than 45 yards?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 24, yesno: true, teamValues: false, shortName: "3+ Turnovers", longName: "Will there be 3 or more total turnovers?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 25, yesno: true, teamValues: false, shortName: "Safety", longName: "Will there be a safety (either team)?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 26, yesno: true, teamValues: false, shortName: "2 Pt. Conversion", longName: "Will there be a successful 2-point conversion (either team)?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 27, yesno: true, teamValues: false, shortName: "Two Minute Warning Score", longName: "Will a team score in the last 2 minutes of a half?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 28, yesno: true, teamValues: false, shortName: "Tie Game", longName: "Other than 0-0, will there be a tie at any point?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 29, yesno: true, teamValues: false, shortName: "50+ Points Scored", longName: "Will there be more than 50 points scored?", value: 0, finalized: false}));
  categoryList.push(new Category({id: 30, yesno: true, teamValues: false, shortName: "Overtime", longName: "Will the game go into overtime?", value: 0, finalized: false}));
  Category.insertMany(categoryList, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Initialized categories.");
    }
  });
}

function getUpdate() {
  var options = {
    url: "http://www.nfl.com/liveupdate/game-center/" + GAMEID + "/" + GAMEID +"_gtd.json",
    json: true
  }
  request(options, function(err, resp, body){
    if (err) {
      console.log(err);
      return null;
    }
    homeTeam = body[GAMEID].home.abbr;
    awayTeam = body[GAMEID].away.abbr;

    // 1 - Which team will win the game?
    Category.findOne({id: 1}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.score.T;
        let awayScore = body[GAMEID].away.score.T;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 1}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 2 - Which team will win the coin toss?
    // Unfortunately, this doesn't seem to be in the JSON anywhere. The coin toss for the
    // Super Bowl is often documented online, so this may end up being a manual update query
    // in mongo on the side

    // 3 - Which team will score first?
    Category.findOne({id: 3}, function(err, result){
      if (!result.finalized) {
        let someoneHasScored = (body[GAMEID].home.score.T !== 0 || body[GAMEID].away.score.T !== 0);
        if (someoneHasScored) {
          let firstScoreKey = Object.keys(body[GAMEID].scrsummary)[0];
          let firstScoreTeam = body[GAMEID].scrsummary[firstScoreKey].team;

          let firstScoreResult;
          switch (firstScoreTeam) {
            case body[GAMEID].home.abbr:
              firstScoreResult = 1;
              break;
            case body[GAMEID].away.abbr:
              firstScoreResult = 2;
              break;
            default:
              console.log("Error: First score team ("+firstScoreTeam+") does not match home team ("+body[GAMEID].home.abbr+") or away team ("+body[GAMEID].away.abbr+")");
              firstScoreResult = 0;
              someoneHasScored = false;
          }
          Category.updateOne({id: 3}, {value: firstScoreResult, finalized: someoneHasScored}).exec();
        }
      }
    });

    // 4 - Which team will have more first downs?
    Category.findOne({id: 4}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.stats.team.totfd;
        let awayScore = body[GAMEID].away.stats.team.totfd;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 4}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 5 - Which team will have more total yards?
    Category.findOne({id: 5}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.stats.team.totyds;
        let awayScore = body[GAMEID].away.stats.team.totyds;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 5}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 6 - Which team will have more passing yards?
    Category.findOne({id: 6}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.stats.team.pyds;
        let awayScore = body[GAMEID].away.stats.team.pyds;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 6}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 7 - Which team will have more rushing yards?
    Category.findOne({id: 7}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.stats.team.ryds;
        let awayScore = body[GAMEID].away.stats.team.ryds;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 7}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 8 - Which team will have a higher pass completion percentage?
    Category.findOne({id: 8}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeAtt = 0, homeCmp = 0;
        Object.keys(body[GAMEID].home.stats.passing).forEach(function(key){
          homeAtt += body[GAMEID].home.stats.passing[key].att;
          homeCmp += body[GAMEID].home.stats.passing[key].cmp;
        });
        let homeScore = Math.round((homeCmp / homeAtt) * 1000) / 10;

        let awayAtt = 0, awayCmp = 0;
        Object.keys(body[GAMEID].away.stats.passing).forEach(function(key){
          awayAtt += body[GAMEID].away.stats.passing[key].att;
          awayCmp += body[GAMEID].away.stats.passing[key].cmp;
        });
        let awayScore = Math.round((awayCmp / awayAtt) * 1000) / 10;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 8}, {homeVal: homeScore+"%", awayVal: awayScore+"%", value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 9 - Which team will have more touchdowns?
    Category.findOne({id: 9}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = 0, awayScore = 0;
        Object.keys(body[GAMEID].scrsummary).forEach(function(key){
          scoreJSON = body[GAMEID].scrsummary[key];
          if (scoreJSON.type === "TD") {
            if (scoreJSON.team === body[GAMEID].home.abbr) {
              homeScore++;
            } else if (scoreJSON.team === body[GAMEID].away.abbr) {
              awayScore++;
            }
          }
        });

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 9}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 10 - Which team will have more field goals?
    Category.findOne({id: 10}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = 0, awayScore = 0;
        Object.keys(body[GAMEID].scrsummary).forEach(function(key){
          scoreJSON = body[GAMEID].scrsummary[key];
          if (scoreJSON.type === "FG") {
            if (scoreJSON.team === body[GAMEID].home.abbr) {
              homeScore++;
            } else if (scoreJSON.team === body[GAMEID].away.abbr) {
              awayScore++;
            }
          }
        });

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 10}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 11 - Which team will have more sacks?
    Category.findOne({id: 11}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = 0, awayScore = 0;
        Object.keys(body[GAMEID].home.stats.defense).forEach(function(key){
          homeScore += body[GAMEID].home.stats.defense[key].sk;
        });
        Object.keys(body[GAMEID].away.stats.defense).forEach(function(key){
          awayScore += body[GAMEID].away.stats.defense[key].sk;
        });

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 11}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 12 - Which team will have more turnovers?
    Category.findOne({id: 12}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.stats.team.trnovr;
        let awayScore = body[GAMEID].away.stats.team.trnovr;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 12}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 13 - Which team will have more penalties?
    Category.findOne({id: 13}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.stats.team.pen;
        let awayScore = body[GAMEID].away.stats.team.pen;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 13}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 14 - Which team will have more penalty yards?
    Category.findOne({id: 14}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = body[GAMEID].home.stats.team.penyds;
        let awayScore = body[GAMEID].away.stats.team.penyds;

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 14}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 15 - Which team will have a longer time of possession?
    Category.findOne({id: 15}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore, awayScore = 0;
        let homeStr = body[GAMEID].home.stats.team.top;
        let homeStrSplit = homeStr.split(':');
        homeScore = (homeStrSplit[0] * 60) + homeStrSplit[1];

        let awayStr = body[GAMEID].away.stats.team.top;
        let awayStrSplit = awayStr.split(':');
        awayScore = (awayStrSplit[0] * 60) + awayStrSplit[1];

        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 15}, {homeVal: homeStr, awayVal: awayStr, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 16 - Which team will score last?
    Category.findOne({id: 16}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreKeys = Object.keys(body[GAMEID].scrsummary);
        let lastScoreKey = scoreKeys[scoreKeys.length - 1];
        let lastScoreTeam = body[GAMEID].scrsummary[lastScoreKey].team;

        let lastScoreResult;
        switch (lastScoreTeam) {
          case body[GAMEID].home.abbr:
            lastScoreResult = 1;
            break;
          case body[GAMEID].away.abbr:
            lastScoreResult = 2;
            break;
          default:
            console.log("Error: Last score team ("+lastScoreTeam+") does not match home team ("+body[GAMEID].home.abbr+") or away team ("+body[GAMEID].away.abbr+")");
            lastScoreResult = 0;
            isFinalized = false;
        }
        Category.updateOne({id: 16}, {value: lastScoreResult, finalized: isFinalized}).exec();
      }
    });

    // 17 - Which team will have the longest play in yards?
    // Consider removing this question, as the JSON magic required to complete it is astronomical

    // 17 - Which team will have the longest field goal in yards?
    Category.findOne({id: 17}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let homeScore = 0, awayScore = 0;
        if (body[GAMEID].home.stats.kicking != null) {
          Object.keys(body[GAMEID].home.stats.kicking).forEach(function(key){
            let thisKicker = body[GAMEID].home.stats.kicking[key];
            if (thisKicker.fgyds > homeScore) homeScore = thisKicker.fgyds;
          });
        }
        if (body[GAMEID].away.stats.kicking != null) {
          Object.keys(body[GAMEID].away.stats.kicking).forEach(function(key){
            let thisKicker = body[GAMEID].away.stats.kicking[key];
            if (thisKicker.fgyds > awayScore) awayScore = thisKicker.fgyds;
          });
        }


        let scoreResult;
        if (homeScore > awayScore) {
          scoreResult = 1;
        } else if (homeScore < awayScore) {
          scoreResult = 2;
        } else {
          scoreResult = 0;
        }
        Category.updateOne({id: 17}, {homeVal: homeScore, awayVal: awayScore, value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 18 - Will the coin toss be "Heads"?
    // Unfortunately, this doesn't seem to be in the JSON anywhere. The coin toss for the
    // Super Bowl is often documented online, so this may end up being a manual update query
    // in mongo on the side

    // 19 - Will a team score in the first 7 minutes of the game?
    Category.findOne({id: 19}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (scoreJSON.end.qtr != 1) || (scoreJSON.end.qtr == 1 && timestampToSeconds(scoreJSON.end.time) < 480);
        let scoreResult = 0;
        Object.keys(body[GAMEID].drives).forEach(function(key){
          scoreJSON = body[GAMEID].drives[key];
          if (scoreJSON.result == "Touchdown" || scoreJSON.result == "Field Goal" || scoreJSON.result == "Safety") {
            if (scoreJSON.end.qtr == 1) && (timestampToSeconds(scoreJSON.end.time) >= 480) {
              isFinalized = true;
              scoreResult = 1;
            }
          }
        });
        Category.updateOne({id: 19}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 20 - Will there be a missed FG or extra point attempt?
    Category.findOne({id: 20}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        if (body[GAMEID].home.stats.kicking != null) {
          Object.keys(body[GAMEID].home.stats.kicking).forEach(function(key) {
            let thisKicker = body[GAMEID].home.stats.kicking[key];
            if (thisKicker.fgm !== thisKicker.fga) {
              isFinalized = true;
              scoreResult = 1;
            }
          });
        }
        if (body[GAMEID].away.stats.kicking != null) {
          Object.keys(body[GAMEID].away.stats.kicking).forEach(function(key){
            let thisKicker = body[GAMEID].away.stats.kicking[key];
            if (thisKicker.fgm !== thisKicker.fga) {
              isFinalized = true;
              scoreResult = 1;
            }
          });
        }
        Category.updateOne({id: 20}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 21 - Will there be a kick or punt returned for a touchdown?
    Category.findOne({id: 21}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        if (body[GAMEID].home.stats.kickret != null) {
          Object.keys(body[GAMEID].home.stats.kickret).forEach(function(key) {
            let thisReturner = body[GAMEID].home.stats.kickret[key];
            if (thisReturner.tds > 0) {
              isFinalized = true;
              scoreResult = 1;
            }
          });
        }
        if (body[GAMEID].away.stats.kickret != null) {
          Object.keys(body[GAMEID].away.stats.kickret).forEach(function(key){
            let thisReturner = body[GAMEID].away.stats.kickret[key];
            if (thisReturner.tds > 0) {
              isFinalized = true;
              scoreResult = 1;
            }
          });
        }
        Category.updateOne({id: 21}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 22 - Will there be a Defensive Touchdown (either team)?
    Category.findOne({id: 22}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        Object.keys(body[GAMEID].scrsummary).forEach(function(key){
          scoreJSON = body[GAMEID].scrsummary[key];
          if ((scoreJSON.desc.search("[Ii]nterception return") != -1) || (scoreJSON.desc.search("[Ff]umble return") != -1)) {
            isFinalized = true;
            scoreResult = 1;
          }
        });
        Category.updateOne({id: 22}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 23 - Will there be a successful field goal longer than 45 yards?
    Category.findOne({id: 23}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        Object.keys(body[GAMEID].scrsummary).forEach(function(key){
          scoreJSON = body[GAMEID].scrsummary[key];
          if (scoreJSON.type = "FG") {
            let fieldGoalLength = Number(scoreJSON.desc.search(/\d+ yd\./).split(' ')[0]);
            if (fieldGoalLength >= 45){
              isFinalized = true;
              scoreResult = 1;
            }
          }
        });

        Category.updateOne({id: 23}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 24 - Will there be 3 or more total turnovers?
    Category.findOne({id: 24}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        let totalTurnovers = body[GAMEID].home.stats.team.trnovr + body[GAMEID].away.stats.team.trnovr;
        if(totalTurnovers >= 3){
          isFinalized = true;
          scoreResult = 1;
        }

        Category.updateOne({id: 24}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 25 - Will there be a safety (either team)?
    // Note: this is in the JSON under body[GAMEID].scrsummary, where type = "SAF"
    Category.findOne({id: 25}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        Object.keys(body[GAMEID].scrsummary).forEach(function(key){
          scoreJSON = body[GAMEID].scrsummary[key];
          if (scoreJSON.type === "SAF") {
            isFinalized = true;
            scoreResult = 1;
          }
        });

        Category.updateOne({id: 25}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 26 - Will there be a successful 2-point conversion (either team)?
    Category.findOne({id: 26}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        Object.keys(body[GAMEID].drives).forEach(function(drive){
          Object.keys(body[GAMEID].drives[drive].plays).forEach(function(play){
            if(body[GAMEID].drives[drive].plays[play].note.search("2P") != -1){
              //TODO - finish implementing this
            }
          });
        });

        Category.updateOne({id: 26}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 27 - Will a team score in the last 2 minutes of a half?
    Category.findOne({id: 27}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        Object.keys(body[GAMEID].drives).forEach(function(key){
          scoreJSON = body[GAMEID].drives[key];
          if (scoreJSON.result == "Touchdown" || scoreJSON.result == "Field Goal" || scoreJSON.result == "Safety") {
            if (scoreJSON.end.qtr == 2 || scoreJSON.end.qtr == 4) && (timestampToSeconds(scoreJSON.end.time) <= 120) {
              isFinalized = true;
              scoreResult = 1;
            }
          }
        });

        Category.updateOne({id: 27}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });

    // 28 - Other than 0-0, will there be a tie at any point?
    // TODO - not implemented

    // 29 - Will there be more than 50 points scored?
    Category.findOne({id: 29}, function(err, result){
      if (!result.finalized) {
        let isFinalized = (body[GAMEID].qtr === "Final");
        let scoreResult = 0;
        let totalScore = body[GAMEID].home.score.T + body[GAMEID].away.score.T;
        if(totalScore >= 50){
          isFinalized = true;
          scoreResult = 1;
        }
        Category.updateOne({id: 29}, {value: scoreResult, finalized: isFinalized}).exec();
      }
    });
    // 30 - Will the game go into overtime?
    // TODO - not implemented
  });
}

function timestampToSeconds(timestamp) {
  let minutes = timestamp.split(":")[0];
  let seconds = timestamp.split(":")[1];
  return minutes*60 + seconds;
}

app.get("/", function(req, res){
  Category.countDocuments({}, function(err,count){
    if(count === 0) initCategories();
  });
  //DEBUG to force update every run
  Category.updateMany({},{finalized: false}).exec();

  getUpdate();

  var outputItems = Category.find({}, function(err, docs){
    res.render('index', {home: homeTeam, away: awayTeam, categories: docs});
  });

});

app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
