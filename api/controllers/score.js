const asyncWrapper = require('../middleware/async');
const Score = require('../models/Score');

const submitScore = asyncWrapper(async (req, res) => {
  scoreData = req.body;
  // score = {
  //   player_name: req.body.userId,
  //   score: req.body.username,
  // };
  console.log('new score');
  newScore = await Score.create(scoreData);

  res.status(201).json(newScore);
});

const getAllScores = asyncWrapper(async (req, res) => {
  scoresList = await Score.find();
  res.status(201).json(scoresList);
});

const getHighestScore = asyncWrapper(async (req, res) => {
  try {
    const highestScore = await Score.findOne().sort({ score: -1 }).limit(1);
    res.status(200).json(highestScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve highest score' });
  }
});

module.exports = { submitScore, getAllScores, getHighestScore };
