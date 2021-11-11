const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const banner = require('../assets/img/banner');
const avatar = require('../assets/img/avatar');

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
    maxlength: 32,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 64,
  },
  theme: {
    type: String,
    required: true,
    default: 'light',
  },
  bio: {
    type: String,
    maxlength: 300,
  },
  avatar: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      image: avatar.avatar,
      contentType: 'image/jpg',
    },
  },
  banner: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      image: banner.banner,
      contentType: 'image/jpg',
    },
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

schema.plugin(uniqueValidator);
module.exports = mongoose.model('User', schema);
