const User = require('../models/User');
const asyncWrapper = require('../middleware/async');

// const User = new mongoose.Schema({
//   userId: { type: String, required: true },
//   username: { type: String, required: true },
//   fullName: { type: String },
//   country: { type: String },
//   prifilePic: { type: String },
//   posts: { type: Array },
// });

const createNewUser = asyncWrapper(async (req, res) => {
  user = {
    userId: req.body.userId,
    username: req.body.username,
    fullName: req.body.fullName,
    profilePic: req.body.profilePic,
    email: req.body.email,
  };
  existingUser = await User.findOne({ userId: user.userId });
  if (!existingUser) {
    console.log('new user');
    newUser = await User.create(user);
    res.status(201).json(newUser);
  }
  if (existingUser) {
    // console.log('user loged in');
    res.status(201).json(existingUser);
  }
});
const getUser = asyncWrapper(async (req, res) => {
  const userId = req.query.id;
  user = await User.findOne({ userId: userId });
  // console.log('get user');
  res.status(201).json(user);
});
const getAllUser = asyncWrapper(async (req, res) => {
  allUser = await User.find();
  // console.log('user exict');
  res.status(201).json(allUser);
});
// update user details
const updateUser = asyncWrapper(async (req, res) => {
  // console.log(req.body);
  const { userId, username, fullName, profilePic } = req.body;
  user = await User.findOne({ userId: userId });
  filter = { userId: userId };
  update = { username: username, fullName: fullName, profilePic: profilePic };
  updatedUser = await User.findOneAndUpdate(filter, update);
  console.log('user updated');
  res.status(201).json(updatedUser);
});
// update darkmode
const setDarkMode = asyncWrapper(async (req, res) => {
  const { userId, isDarkMode } = req.body;
  user = await User.findOne({ userId: userId });
  filter = { userId: userId };
  update = { isDarkMode: isDarkMode };
  updatedUser = await User.findOneAndUpdate(filter, update);
  console.log('user updated');
  res.status(201).json(updatedUser);
});

module.exports = {
  getAllUser,
  getUser,
  createNewUser,
  updateUser,
  setDarkMode,
};
