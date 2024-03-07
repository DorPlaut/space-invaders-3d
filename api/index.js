const express = require('express');
const path = require('path'); // Import the 'path' module

const app = express();

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, './dist')));

// Other app logic

// Run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

module.exports = app;
