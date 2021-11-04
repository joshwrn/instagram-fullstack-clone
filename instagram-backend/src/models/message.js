const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  message: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 140,
  },
  date: {
    required: true,
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Message', schema);
