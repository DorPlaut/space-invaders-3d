// // run express server
// const express = require('express');
// const { default: getAllScores } = require('./score');
// const { default: getHighestScore } = require('./getHighestScore');
// const { default: submitScore } = require('./submitScore');
// const { default: connectDB } = require('./db');
// const app = express();

// // serve our routes
// // handle scoure route
// app.get('/api/score', getAllScores);
// app.get('/api/getHighestScore', getHighestScore);
// app.get('/api/submitScore', submitScore);
// // server hello world on api route
// app.get('/api', (req, res) => {
//   res.send('Hello World!');
// });
// // server the app on port 3000
// app.listen(3000, () => {
//   // async function for db connection
//   connectDB(process.env.MONGO_URI);
//   console.log('Server listening on port 3000');
// });
