import connectDB from './db';
import Score from './models/Score';

const submitScore = async (req, res) => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);
    // define new data
    const scoreData = req.body;
    console.log(scoreData);
    // store new data in db
    const newScore = await Score.create(scoreData);
    if (newScore) {
      res.status(201).json(newScore);
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    // Send an error response
    res
      .status(500)
      .json({ message: 'An error occurred while fetching scores.' });
  }
};

export default submitScore;
