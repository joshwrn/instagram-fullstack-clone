const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  imageKey: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Post', schema);
