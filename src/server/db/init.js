// Import models
const Game = require('../models/game');
const Question = require('../models/question');
const Team = require('../models/team');

initGame = async (gameId) => {
  // Set up Game and Team Documents
  // TODO

  // Add question list
  const questionList = [];
  questionList.push(new Question({gameId, questionId: 1, yesno: false, teamValues: false, shortName: "Win the Game", longName: "Which team will win the game?"}));
  questionList.push(new Question({gameId, questionId: 2, yesno: false, teamValues: false, shortName: "Coin Toss", longName: "Which team will win the coin toss?"}));
  questionList.push(new Question({gameId, questionId: 3, yesno: false, teamValues: false, shortName: "First Score", longName: "Which team will score first?"}));
  questionList.push(new Question({gameId, questionId: 4, yesno: false, teamValues: true, shortName: "First Downs", longName: "Which team will have more first downs?"}));
  questionList.push(new Question({gameId, questionId: 5, yesno: false, teamValues: true, shortName: "Total Yards", longName: "Which team will have more total yards?"}));
  questionList.push(new Question({gameId, questionId: 6, yesno: false, teamValues: true, shortName: "Passing Yards", longName: "Which team will have more passing yards?"}));
  questionList.push(new Question({gameId, questionId: 7, yesno: false, teamValues: true, shortName: "Rushing Yards", longName: "Which team will have more rushing yards?"}));
  questionList.push(new Question({gameId, questionId: 8, yesno: false, teamValues: true, shortName: "Pass Completion", longName: "Which team will have a higher pass completion percentage?"}));
  questionList.push(new Question({gameId, questionId: 9, yesno: false, teamValues: true, shortName: "Touchdowns", longName: "Which team will have more touchdowns?"}));
  questionList.push(new Question({gameId, questionId: 10, yesno: false, teamValues: true, shortName: "Field Goals", longName: "Which team will have more field goals?"}));
  questionList.push(new Question({gameId, questionId: 11, yesno: false, teamValues: true, shortName: "Sacks", longName: "Which team will have more sacks?"}));
  questionList.push(new Question({gameId, questionId: 12, yesno: false, teamValues: true, shortName: "Turnovers", longName: "Which team will have more turnovers?"}));
  questionList.push(new Question({gameId, questionId: 13, yesno: false, teamValues: true, shortName: "Penalties", longName: "Which team will have more penalties?"}));
  questionList.push(new Question({gameId, questionId: 14, yesno: false, teamValues: true, shortName: "Penalty Yards", longName: "Which team will have more penalty yards?"}));
  questionList.push(new Question({gameId, questionId: 15, yesno: false, teamValues: true, shortName: "Time of Possession", longName: "Which team will have a longer time of possession?"}));
  questionList.push(new Question({gameId, questionId: 16, yesno: false, teamValues: false, shortName: "Last Score", longName: "Which team will score last?"}));
  questionList.push(new Question({gameId, questionId: 17, yesno: false, teamValues: true, shortName: "Longest Field Goal", longName: "Which team will have the longest field goal in yards?"}));
  questionList.push(new Question({gameId, questionId: 18, yesno: true, teamValues: false, shortName: "Coin Lands Heads", longName: "Will the coin toss be \"Heads\"?"}));
  questionList.push(new Question({gameId, questionId: 19, yesno: true, teamValues: false, shortName: "Score in 7 Minutes", longName: "Will a team score in the first 7 minutes of the game?"}));
  questionList.push(new Question({gameId, questionId: 20, yesno: true, teamValues: false, shortName: "Missed FG or XP", longName: "Will there be a missed FG or extra point attempt?"}));
  questionList.push(new Question({gameId, questionId: 21, yesno: true, teamValues: false, shortName: "Kick Returned for TD", longName: "Will there be a kick or punt returned for a touchdown?"}));
  questionList.push(new Question({gameId, questionId: 22, yesno: true, teamValues: false, shortName: "Defensive TD", longName: "Will there be a Defensive Touchdown (either team)?"}));
  questionList.push(new Question({gameId, questionId: 23, yesno: true, teamValues: false, shortName: "45+ Yard FG", longName: "Will there be a successful field goal longer than 45 yards?"}));
  questionList.push(new Question({gameId, questionId: 24, yesno: true, teamValues: false, shortName: "3+ Turnovers", longName: "Will there be 3 or more total turnovers?"}));
  questionList.push(new Question({gameId, questionId: 25, yesno: true, teamValues: false, shortName: "Safety", longName: "Will there be a safety (either team)?"}));
  questionList.push(new Question({gameId, questionId: 26, yesno: true, teamValues: false, shortName: "2 Pt. Conversion", longName: "Will there be a successful 2-point conversion (either team)?"}));
  questionList.push(new Question({gameId, questionId: 27, yesno: true, teamValues: false, shortName: "Two Minute Warning Score", longName: "Will a team score in the last 2 minutes of a half?"}));
  questionList.push(new Question({gameId, questionId: 28, yesno: true, teamValues: false, shortName: "Tie Game", longName: "Other than 0-0, will there be a tie at any point?"}));
  questionList.push(new Question({gameId, questionId: 29, yesno: true, teamValues: false, shortName: "50+ Points Scored", longName: "Will there be more than 50 points scored?"}));
  questionList.push(new Question({gameId, questionId: 30, yesno: true, teamValues: false, shortName: "Overtime", longName: "Will the game go into overtime?"}));
  Question.insertMany(questionList, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log(`Initialized questions for gameId ${gameId}.`);
    }
  });
}

module.exports = initGame;