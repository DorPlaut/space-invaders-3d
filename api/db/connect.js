const moongose = require('mongoose');
// const { options } = require('../routes/tasks');

const connectDB = (url) => {
  console.log('connectinng to DB..');
  return moongose.connect(url, {});
};

module.exports = connectDB;
