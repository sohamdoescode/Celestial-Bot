const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
  Badges: Array,
  Blacklisted: { type: Boolean, default: false },
  UserID: String,
});

module.exports = mongoose.model("user", Schema);
