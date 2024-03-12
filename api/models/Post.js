const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: String },
    username: { type: String },
    profilePic: { type: String },
    locationDetails: {
      locationName: { type: String },
      locationType: { type: String },
      carAccess: { type: String },
      hikes: { type: String },
      camping: { type: String },
      price: { type: String },
      mapLocation: { type: Object },
    },
    postContent: { type: String },
    photos: { type: Array },
    publish: { type: Boolean },
    likes: [{ userId: { type: String }, username: { type: String } }],
    comments: [
      {
        userId: { type: String },
        username: { type: String },
        comment: { type: String },
        profilePic: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
