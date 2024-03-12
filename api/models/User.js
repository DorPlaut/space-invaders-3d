const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  fullName: { type: String },
  email: { type: String },
  country: { type: String },
  profilePic: { type: String },
  posts: { type: Array },
  isAdmin: { type: Boolean, default: false },
  isDarkMode: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
