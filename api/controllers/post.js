const Post = require('../models/Post');
const User = require('../models/User');
const asyncWrapper = require('../middleware/async');

//   userId: { type: String },
//   username: { type: String },
//   locationDetails: {
//     locationName: { type: String },
//     locationType: { type: String },
//     carAccess: { type: String },
//     hikes: { type: String },
//     camping: { type: String },
//     price: { type: String },
//   },
//   postContent: { type: String },
//   photos: { type: Array },

const createNewPost = asyncWrapper(async (req, res) => {
  post = {
    userId: req.body.userId,
    username: req.body.username,
    profilePic: req.body.profilePic,
    locationDetails: {
      locationName: req.body.locationName,
      locationType: req.body.locationType,
      carAccess: req.body.carAccess,
      hikes: req.body.hikes,
      camping: req.body.camping,
      price: req.body.price,
      mapLocation: req.body.mapLocation,
    },
    postContent: req.body.postContent,
    photos: req.body.photos,
    publish: req.body.publish,
    likes: [],
    comments: [],
  };
  console.log('new post');
  console.log(post);
  newPost = await Post.create(post);
  // update user posts
  // postId = newPost._id;
  // user = await User.findOne({ userId: post.userId });
  // filter = { userId: post.userIdd };

  // userPosts = [];
  // user.posts.map((i) => {
  //   userPosts.push(i);
  // });
  // userPosts.push({ postId: postId });

  res.status(201).json(newPost);
});

const handleLikes = asyncWrapper(async (req, res) => {
  const { _id, liked, username, userId } = req.body;
  like = {
    userId: userId,
    username: username,
  };
  console.log(req.body);
  // console.log(like);
  filter = { _id: _id };
  post = await Post.findById(_id);
  postLikes = [];
  post.likes.map((i) => {
    postLikes.push(i);
  });
  likeExict = false;
  postLikes.map((i) => {
    if (i.userId == like.userId) {
      console.log('exict');
      likeExict = true;
    }
    if (i.userId != like.userId) {
      console.log('Not exicting');
      likeExict = false;
    }
  });
  if (liked && !likeExict) {
    postLikes.push(like);
    update = { likes: postLikes };
  }
  if (!liked && likeExict) {
    postLikes = postLikes.filter((i) => {
      return i.userId != like.userId;
    });
    update = { likes: postLikes };
  }
  console.log('like exics - ', likeExict);
  // console.log('start');
  // console.log(postLikes);
  // console.log('finish');
  updatedPost = await Post.findOneAndUpdate(filter, update);
  res.status(201).json(postLikes);
});
// POST COMMENT
const postComment = asyncWrapper(async (req, res) => {
  const { _id, username, userId, profilePic, comment } = req.body;
  newComment = {
    username: username,
    userId: userId,
    profilePic: profilePic,
    comment: comment,
  };
  filter = { _id: _id };
  post = await Post.findById(_id);
  postComments = [];
  post.comments.map((i) => {
    postComments.push(i);
  });
  postComments.push(newComment);
  update = { comments: postComments };
  updatedPost = await Post.findOneAndUpdate(filter, update);
  res.status(201).json(postComments);
});

const getAllPosts = asyncWrapper(async (req, res) => {
  allPosts = await Post.find().sort({ createdAt: -1 });

  res.status(201).json(allPosts);
});

module.exports = { createNewPost, getAllPosts, handleLikes, postComment };
