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
// // Serve static files from the js app
// app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static('../public'));

// Other app logic

// Run the server
const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
