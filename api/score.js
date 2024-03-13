import connectDB from './db';
import Score from './models/Score';

const getAllScores = async (req, res) => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    // Fetch all scores from the database
    const scoresList = await Score.find();
    // Send the scores list as a JSON response with a 200 status code
    res.status(200).json(scoresList);
  } catch (error) {
    // Handle errors
    console.error(error);
    // Send an error response
    res
      .status(500)
      .json({ message: 'An error occurred while fetching scores.' });
  }
};

export default getAllScores;
