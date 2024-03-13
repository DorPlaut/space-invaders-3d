import connectDB from './db';
import Score from './models/Score';

const getHighestScore = async (req, res) => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    // Fetch all scores from the database
    const highestScore = await Score.findOne().sort({ score: -1 }).limit(1);
    res.status(200).json(highestScore);
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
