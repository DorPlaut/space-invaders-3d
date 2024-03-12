const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {
  submitScore,
  getAllScores,
  getHighestScore,
} = require('../controllers/score');

router.post('/submitScore', submitScore);
router.get('/getAllScores', getAllScores);
router.get('/getHighestScore', getHighestScore);

module.exports = router;
