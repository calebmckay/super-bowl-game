import testData from './fixtures/evalData';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import evalFunctions from '../src/server/nfl-api/eval';

const cacheDir = path.join(__dirname,'fixtures','__gameDataCache__');

test('should evaluate game data correctly', async (done) => {
  // Iterate through each test case, evaluate the data, and compare it
  // to the expected output.
  for (const testCase of testData) {
    if (testCase.gameId) {
      let gameData;
      try {
        // Load file from our game data cache
        const dataBuffer = fs.readFileSync(path.join(cacheDir, `${testCase.gameId}.json`));
        gameData = JSON.parse(dataBuffer.toString())
      } catch (e) {
        // Game doesn't exist in cache. Retrieve it from NFL's API.
        const url = `http://www.nfl.com/liveupdate/game-center/${testCase.gameId}/${testCase.gameId}_gtd.json`
        const response = await axios.get(url, { responseType: 'json' });
        gameData = response.data[testCase.gameId];

        // Save the game data to the cache
        fs.writeFileSync(
          path.join(cacheDir, `${testCase.gameId}.json`),
          JSON.stringify(gameData)
        );
      }

      // Check the result for each eval function
      for (const key of Object.keys(testCase.expected)) {
        if (evalFunctions[key]) {
          if (testCase.expected[key] !== null) {
            const result = evalFunctions[key](gameData);
            expect(result.finalized, `${testCase.gameId} - ${key}`).toBe(true);
            expect(result.value, `${testCase.gameId} - ${key}`).toBe(testCase.expected[key]);
          }
        } else {
          console.warn(`No evalFunction for key ${key}`);
        }
      }
    }
  }
  done();
})