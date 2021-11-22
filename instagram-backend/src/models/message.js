const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  message: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 140,
  },
  thread: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageThread',
  },
  seen: {
    required: true,
    type: Boolean,
    default: false,
  },
  date: {
    required: true,
    type: Date,
    default: Date.now,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Message', schema);
