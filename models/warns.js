const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
  UserID: String,
  GuildID: String,
  WarnCount: { type: Number, default: 0 },
  WarnCases: { type: Array, default: [] },
});

module.exports = mongoose.model("warns", Schema);
