const getHighestScore = asyncWrapper(async (req, res) => {
  try {
    const highestScore = await Score.findOne().sort({ score: -1 }).limit(1);
    res.status(200).json(highestScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve highest score' });
  }
});
