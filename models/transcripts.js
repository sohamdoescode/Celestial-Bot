const mongoose = require("mongoose");

let Schema = new mongoose.Schema({
  GuildID: { type: String, default: null, required: true },
  UserID: { type: String, default: null },
  ChannelID: { type: String, default: null },

  Transcript : {type : Array, default : []}
});

module.exports = mongoose.model("transcripts", Schema);
