const timestampToSeconds = (timestamp) => {
  let minutes = parseInt(timestamp.split(":")[0]);
  let seconds = parseInt(timestamp.split(":")[1]);
  return minutes*60 + seconds;
}

const isFinal = (data) => {
  return data.qtr.search(/[Ff]inal/) !== -1;
}

let evalFunctions = {};

evalFunctions.q1 = (data) => {
  // 1 - Which team will win the game?
  const homeVal = data.home.score.T;
  const awayVal = data.away.score.T;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }
  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q2 = (data) => {
  // 2 - Which team will win the coin toss?

  // Unfortunately, this doesn't seem to be in the JSON anywhere. The coin toss for the
  // Super Bowl is often documented online, so this may end up being a manual update query
  // in mongo on the side
  console.log('Q2 - Coin toss result not retrievable from JSON');
  return null;
}

evalFunctions.q3 = (data) => {
  // 3 - Which team will score first?
  let value = 0;
  const finalized = (data.home.score.T !== 0 || data.away.score.T !== 0);
  if (finalized) {
    const firstScoreKey = Object.keys(data.scrsummary)[0];
    const firstScoreTeam = data.scrsummary[firstScoreKey].team;

    switch (firstScoreTeam) {
      case data.home.abbr:
        value = 1;
        break;
      case data.away.abbr:
        value = -1;
        break;
      default:
        console.log("Q3 - Error: First score team ("+firstScoreTeam+") does not match home team ("+data.home.abbr+") or away team ("+data.away.abbr+")");
        return null;
    }
  }
  return { value, finalized }
}

evalFunctions.q4 = (data) => {
  // 4 - Which team will have more first downs?
  const homeVal = data.home.stats.team.totfd;
  const awayVal = data.away.stats.team.totfd;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q5 = (data) => {
  // 5 - Which team will have more total yards?
  const homeVal = data.home.stats.team.totyds;
  const awayVal = data.away.stats.team.totyds;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q6 = (data) => {
  // 6 - Which team will have more passing yards?
  const homeVal = data.home.stats.team.pyds;
  const awayVal = data.away.stats.team.pyds;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q7 = (data) => {
  // 7 - Which team will have more rushing yards?
  const homeVal = data.home.stats.team.ryds;
  const awayVal = data.away.stats.team.ryds;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q8 = (data) => {
  // 8 - Which team will have a higher pass completion percentage?

  // To perform this, we add up the passing attempts and completion
  // for all QBs on each team
  let score = { home: 0, away: 0 };

  ['home', 'away'].forEach((team) => {
    const thisTeam = data[team];
    let att = 0, cmp = 0;
    Object.keys(thisTeam.stats.passing).forEach(function(key){
      att += thisTeam.stats.passing[key].att;
      cmp += thisTeam.stats.passing[key].cmp;
    });
    // Round to the nearest 0.1 percent
    score[team] = Math.round((cmp / att) * 1000) / 10.0;
  })

  let value;
  if (score.home > score.away) {
    value = 1;
  } else if (score.home < score.away) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal: score.home+"%",
    awayVal: score.away+"%",
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q9 = (data) => {
  // 9 - Which team will have more touchdowns?

  // Iterate through the game's scoring summary, count up
  // touchdowns for each team, and see who has more
  let homeVal = 0, awayVal = 0;
  Object.keys(data.scrsummary).forEach((key) => {
    scoreJSON = data.scrsummary[key];
    if (scoreJSON.type === "TD") {
      if (scoreJSON.team === data.home.abbr) {
        homeVal++;
      } else if (scoreJSON.team === data.away.abbr) {
        awayVal++;
      }
    }
  });

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q10 = (data) => {
  // 10 - Which team will have more field goals?

  // Iterate through the game's scoring summary, count up
  // field goals for each team, and see who has more
  let homeVal = 0, awayVal = 0;
  Object.keys(data.scrsummary).forEach((key) => {
    scoreJSON = data.scrsummary[key];
    if (scoreJSON.type === "FG") {
      if (scoreJSON.team === data.home.abbr) {
        homeVal++;
      } else if (scoreJSON.team === data.away.abbr) {
        awayVal++;
      }
    }
  });

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q11 = (data) => {
  // 11 - Which team will have more sacks?
  let homeVal = 0, awayVal = 0;
  Object.keys(data.home.stats.defense).forEach(function(key){
    homeVal += data.home.stats.defense[key].sk;
  });
  Object.keys(data.away.stats.defense).forEach(function(key){
    awayVal += data.away.stats.defense[key].sk;
  });

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }
  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q12 = (data) => {
  // 12 - Which team will have more turnovers?
  const homeVal = data.home.stats.team.trnovr;
  const awayVal = data.away.stats.team.trnovr;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q13 = (data) => {
  // 13 - Which team will have more penalties?
  const homeVal = data.home.stats.team.pen;
  const awayVal = data.away.stats.team.pen;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q14 = (data) => {
  // 14 - Which team will have more penalty yards?
  const homeVal = data.home.stats.team.penyds;
  const awayVal = data.away.stats.team.penyds;

  let value;
  if (homeVal > awayVal) {
    value = 1;
  } else if (homeVal < awayVal) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal,
    awayVal,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q15 = (data) => {
  // 15 - Which team will have a longer time of possession?
  let posSeconds = { home: 0, away: 0 };
  let posStr = { home: '', away: ''};

  ['home', 'away'].forEach((team) => {
    // Grab time of possession string for this team
    posStr[team] = data[team].stats.team.top;
    // Then, split it into minutes/seconds and convert to seconds
    const posStrSplit = posStr[team].split(':');
    posSeconds[team] = (posStrSplit[0] * 60) + posStrSplit[1];
  })

  let value;
  if (posSeconds.home > posSeconds.away) {
    value = 1;
  } else if (posSeconds.home < posSeconds.away) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal: posStr.home,
    awayVal: posStr.away,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q16 = (data) => {
  // 16 - Which team will score last?
  const scoreKeys = Object.keys(data.scrsummary);
  const lastScoreKey = scoreKeys[scoreKeys.length - 1];
  const lastScoreTeam = data.scrsummary[lastScoreKey].team;

  let value;
  switch (lastScoreTeam) {
    case data.home.abbr:
      value = 1;
      break;
    case data.away.abbr:
      value = -1;
      break;
    default:
      console.log("Error: Last score team ("+lastScoreTeam+") does not match home team ("+data.home.abbr+") or away team ("+data.away.abbr+")");
      value = 0;
  }

  return {
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q17 = (data) => {
  // 17 - Which team will have the longest field goal in yards?

  // Despite the slightly deceptive name, `data.${team}.stats.kicking.${player}.fgyards`
  // holds the player's longest FG. We'll use this to determine the answer.
  let score = { home: 0, away: 0 };
  ['home', 'away'].forEach((team) => {
    const thisTeam = data[team];
    if (thisTeam.stats.kicking != null) {
      Object.keys(thisTeam.stats.kicking).forEach(function(key){
        const thisKicker = thisTeam.stats.kicking[key];
        if (thisKicker.fgyds > score[team]) {
          score[team] = thisKicker.fgyds;
        }
      });
    }
  })

  let value;
  if (score.home > score.away) {
    value = 1;
  } else if (score.home < score.away) {
    value = -1;
  } else {
    value = 0;
  }

  return {
    homeVal: score.home,
    awayVal: score.away,
    value,
    finalized: isFinal(data)
  }
}

evalFunctions.q18 = (data) => {
  // 18 - Will the coin toss be "Heads"?

  // Unfortunately, this doesn't seem to be in the JSON anywhere. The coin toss for the
  // Super Bowl is often documented online, so this may end up being a manual update query
  // in mongo on the side
  console.log('Q18 - Coin toss result not retrievable from JSON');
  return null;
}

evalFunctions.q19 = (data) => {
  // 19 - Will a team score in the first 7 minutes of the game?

  // The "first 7 minutes of the game" are any drives ending with a scoring play,
  // completed with more than 8 minutes (480 seconds) remaining in the first quarter
  const EIGHT_MINUTES_IN_SECONDS = 480;
  let value = 0, finalized = false;
  
  // First, grab all drives that occurred in the first 7 minutes
  const sevenMinuteDrives = Object.keys(data.drives).filter((key) => {
    // The drives object has a pesky "crntdrv" (current drive) key, so let's explicitly filter it out
    if (isNaN(key)){
      return false;
    }
    const drive = data.drives[key];

    return drive.end.qtr === 1 && timestampToSeconds(drive.end.time) >= EIGHT_MINUTES_IN_SECONDS;
  })

  // Then, filter to any that resulted in scores
  const sevenMinuteScores = sevenMinuteDrives.filter((key) => {
    const drive = data.drives[key];
    return drive.result === 'Touchdown' || drive.result === 'Field Goal' || drive.result === 'Safety';
  });

  // If we have any left, this answer is resolved
  if (sevenMinuteScores.length > 0) {
    value = 1;
    finalized = true;
  } else {
    // Since the whole JSON is updated at one time, we can assume that if the time left on the game clock
    // is past Q1 8:00, this is finalized (i.e. we don't need to check each drive for the latest time)
    if ((data.qtr != 1) || (timestampToSeconds(data.clock) <= EIGHT_MINUTES_IN_SECONDS)) {
      finalized = true;
    }
  }
  return { value, finalized };
}

evalFunctions.q20 = (data) => {
  // 20 - Will there be a missed FG or extra point attempt?

  // Simply check kicking stats and see if any kicker has more attempts than successes
  let finalized = isFinal(data);
  let value = 0;
  ['home', 'away'].forEach((team) => {
    const thisTeam = data[team]
    if (thisTeam.stats.kicking != null) {
      Object.keys(thisTeam.stats.kicking).forEach(function(key) {
        let thisKicker = thisTeam.stats.kicking[key];
        if (thisKicker.fgm !== thisKicker.fga) {
          finalized = true;
          value = 1;
        }
      });
    }
  })
  return { value, finalized };
}

evalFunctions.q21 = (data) => {
  // 21 - Will there be a kick or punt returned for a touchdown?

  // We need to iterate over both teams' `kickret` and `puntret` objects.
  let finalized = isFinal(data);
  let value = 0;
  ['home', 'away'].forEach((team) => {
    const thisTeam = data[team];
    ['kickret', 'puntret'].forEach((returnType) => {
      const kickStats = thisTeam.stats[returnType];
      if (kickStats != null) {
        Object.keys(kickStats).forEach(function(key) {
          let thisReturner = kickStats[key];
          if (thisReturner.tds > 0) {
            finalized = true;
            value = 1;
          }
        });
      }
    })
  })

  return { value, finalized };
}

evalFunctions.q22 = (data) => {
  // 22 - Will there be a Defensive Touchdown (either team)?

  // Look through all scoring drives and see if the description shows an Interception Return or a Fumble Return
  let finalized = isFinal(data);
  let value = 0;
  Object.keys(data.scrsummary).forEach(function(key){
    const thisScore = data.scrsummary[key];
    if ((thisScore.desc.search("[Ii]nterception return") != -1) || (thisScore.desc.search("[Ff]umble return") != -1)) {
      finalized = true;
      value = 1;
    }
  });

  return { value, finalized };
}

evalFunctions.q23 = (data) => {
  // 23 - Will there be a successful field goal longer than 45 yards?
  let finalized = isFinal(data);
  let value = 0;
  Object.keys(data.scrsummary).forEach(function(key){
    const thisScore = data.scrsummary[key];
    if (thisScore.type === "FG") {
      const fgMatch = thisScore.desc.match(/\d+ yd\./);
      if (fgMatch.length > 0) {
        const fgLength = Number(fgMatch[0].split(' ')[0]);
        if (fgLength >= 45){
          finalized = true;
          value = 1;
        }
      }
    }
  });

  return { value, finalized };
}

evalFunctions.q24 = (data) => {
  // 24 - Will there be 3 or more total turnovers?
  let finalized = isFinal(data);
  let value = 0;
  let totalTurnovers = data.home.stats.team.trnovr + data.away.stats.team.trnovr;
  if(totalTurnovers >= 3){
    finalized = true;
    value = 1;
  }

  return { value, finalized };
}

evalFunctions.q25 = (data) => {
  // 25 - Will there be a safety (either team)?
  // This is in the JSON under data.scrsummary, where type = "SAF"
  let finalized = isFinal(data);
  let value = 0;
  Object.keys(data.scrsummary).forEach(function(key){
    const thisScore = data.scrsummary[key];
    if (thisScore.type === "SAF") {
      finalized = true;
      value = 1;
    }
  });

  return { value, finalized };
}

evalFunctions.q26 = (data) => {
  // 26 - Will there be a successful 2-point conversion (either team)?
  // This will be stored in the JSON under data.drives[drive].plays[play].note
  // A note value of '2PS' is success, while a value of '2PPF' is failure
  let finalized = isFinal(data);
  let value = 0;
  // Use `some()` to break out of the loop as soon as we've found a 2PT conversion.
  Object.keys(data.drives).some((driveNum) => {
    // The drives object has a pesky "crntdrv" (current drive) key, so let's skip it
    if(isNaN(driveNum)) {
      return false;
    }
    const thisDrive = data.drives[driveNum];
    Object.keys(thisDrive.plays).forEach((play) => {
      const thisPlay = thisDrive.plays[play];
      if(thisPlay.note && thisPlay.note.match(/^2PS$/) !== null){
        finalized = true;
        value = 1;
        return true;
      }
    });
  });

  return { value, finalized };
}

evalFunctions.q27 = (data) => {
  // 27 - Will a team score in the last 2 minutes of a half?
  let finalized = isFinal(data);
  let value = 0;
  Object.keys(data.drives).forEach((key) => {
    const thisDrive = data.drives[key];
    if (thisDrive.result == "Touchdown" || thisDrive.result == "Field Goal" || thisDrive.result == "Safety") {
      if ((thisDrive.end.qtr == 2 || thisDrive.end.qtr == 4) && (timestampToSeconds(thisDrive.end.time) <= 120)) {
        finalized = true;
        value = 1;
      }
    }
  });

  return { value, finalized };
}

evalFunctions.q28 = (data) => {
  // 28 - Other than 0-0, will there be a tie at any point?
  let finalized = isFinal(data);
  let value = 0;

  const homeAbbr = data.home.abbr;
  const awayAbbr = data.away.abbr;
  let score = {}
  score[homeAbbr] = 0;
  score[awayAbbr] = 0;

  // Use `some()` to break out of the loop as soon as we've found a tie.
  Object.keys(data.scrsummary).some((key) => {
    const thisDrive = data.scrsummary[key];
    switch (thisDrive.type) {
      case 'TD':
        score[thisDrive.team] += 6;
        const driveDesc = thisDrive.desc.toLowerCase()
        if (driveDesc.includes('kick is good')) {
          score[thisDrive.team] += 1;
        } else if (!driveDesc.includes('kick') && !driveDesc.includes('failed')){
          const extraDesc = /\(.*\)/.exec(driveDesc)[0];
          if (extraDesc.includes('pass') || extraDesc.includes('run')) {
            score[thisDrive.team] += 2;
          }
        }
        break;
      case 'FG':
        score[thisDrive.team] += 3;
        break;
      case 'SAF':
        score[thisDrive.team] += 2;
        break;
    }

    if (score[homeAbbr] === score[awayAbbr]) {
      value = 1;
      finalized = true;
      return true;
    }
  });

  return { value, finalized };
}

evalFunctions.q29 = (data) => {
  // 29 - Will there be more than 50 points scored?
  let finalized = isFinal(data);
  let value = 0;
  const totalScore = data.home.score.T + data.away.score.T;
  if(totalScore >= 50){
    finalized = true;
    value = 1;
  }

  return { value, finalized };
}

evalFunctions.q30 = (data) => {
  // 30 - Will the game go into overtime?
  let finalized = isFinal(data);
  let value = 0;

  if (typeof data.qtr === 'number') {
    if (data.qtr >= 5) {
      value = 1;
    }
  } else if (typeof data.qtr === 'string') {
    if (data.qtr.toLowerCase().includes('overtime')) {
      value = 1;
    }
  }

  return { value, finalized };
}

module.exports = evalFunctions;