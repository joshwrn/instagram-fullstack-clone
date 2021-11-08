const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 16,
  },
  displayName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 16,
  },
  theme: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 300,
  },
  avatar: mongoose.Schema.Types.Mixed,
  banner: mongoose.Schema.Types.Mixed,
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 16,
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

schema.plugin(uniqueValidator);
module.exports = mongoose.model('User', schema);
