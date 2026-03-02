const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Collection name = msgdata
module.exports = mongoose.model("msgdata", msgSchema);