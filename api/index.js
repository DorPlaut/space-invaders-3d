const path = require('path'); // Import the 'path' module
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const scoreRouts = require('./routes/score');
const connectDB = require('./db/connect');

//
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/score', scoreRouts);

// Connect to the database
const connect = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.log(error);
  }
};

// Connect to the database when the function is deployed
connect();

// Export the Express app
module.exports = app;
