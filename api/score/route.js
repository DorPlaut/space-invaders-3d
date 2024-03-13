export const getAllScores = asyncWrapper(async (req, res) => {
  scoresList = await Score.find();
  res.status(201).json(scoresList);
});
