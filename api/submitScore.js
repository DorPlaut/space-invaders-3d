import connectDB from './db';
import Score from './models/Score';

const getHighestScore = async (req, res) => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    // define new data
    coreData = req.body;
    // store new data in db
    newScore = await Score.create(scoreData);
    res.status(201).json(newScore);
  } catch (error) {
    // Handle errors
    console.error(error);
    // Send an error response
    res
      .status(500)
      .json({ message: 'An error occurred while fetching scores.' });
  }
};

export default getHighestScore;