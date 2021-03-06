const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 16,
  },
  displayName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 64,
  },
  theme: {
    type: String,
    required: true,
    default: 'light',
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  bio: {
    type: String,
    maxlength: 300,
  },
  avatar: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MessageThread',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('User', schema);
