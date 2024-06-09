// run express server
const express = require('express');
const { default: getAllScores } = require('./score');
const { default: getHighestScore } = require('./getHighestScore');
const { default: submitScore } = require('./submitScore');
const app = express();

// serve our routes
// handle scoure route
app.get('/api/score', getAllScores);
app.get('/api/getHighestScore', getHighestScore);
app.get('/api/submitScore', submitScore);
// server the app on port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
