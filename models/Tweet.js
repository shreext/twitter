const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId, // It store the id
    ref: 'User',   // Reference to User.js model
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
