// This file contains an array of test data for testing the
// evaluation functions. Each element will either have a 'gameId'
// attribute (meaning it will test a real game's JSON), or a
// 'gameData' attribute containing a subset of simulated game
// data. Each element will also have an 'expected' attribute
// representing the expected output for each question 

const testData = [
  {
    gameId: 2019122911,
    expected: {
      q1 : -1,
      q2 : null,
      q3 : -1,
      q4 : -1,
      q5 : -1,
      q6 : -1,
      q7 : 1,
      q8 : 1,
      q9 : -1,
      q10 : -1,
      q11 : -1,
      q12 : 1,
      q13 : -1,
      q14 : -1,
      q15 : -1,
      q16 : -1,
      q17 : -1,
      q18 : null,
      q19 : 0,
      q20 : 0,
      q21 : 0,
      q22 : 0,
      q23 : 1,
      q24 : 0,
      q25 : 0,
      q26 : 0,
      q27 : 1,
      q28 : 1,
      q29 : 1,
      q30 : 0,
    }
  },
  {
    gameId: 2019122912,
    expected: {
      q1 : -1,
      q2 : null,
      q3 : -1,
      q4 : -1,
      q5 : -1,
      q6 : -1,
      q7 : 1,
      q8 : -1,
      q9 : 1,
      q10 : -1,
      q11 : 1,
      q12 : 1,
      q13 : 1,
      q14 : 1,
      q15 : -1,
      q16 : -1,
      q17 : -1,
      q18 : null,
      q19 : 1,
      q20 : 1,
      q21 : 0,
      q22 : 1,
      q23 : 1,
      q24 : 1,
      q25 : 0,
      q26 : 1,
      q27 : 1,
      q28 : 1,
      q29 : 1,
      q30 : 1,
    }
  },
];

export default testData;