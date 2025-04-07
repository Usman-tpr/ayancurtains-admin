const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  count: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Visit', visitSchema); 