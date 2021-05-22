const mongoose = require("mongoose");

let Schema = new mongoose.Schema({

  GuildID : {type : String, default : null, required : true}, 
  SupportRole: { type: String, default: null },
  TicketCount: { type: Number, default: 0 },
  Category: { type: String, default: null },
  Channel : {type : String, default : null},
  Message : {type : String, default : null}, 

  Prefix: { type: String, default: null }, //text appearing before channel name
  Suffix: { type: String, default: null }, //text appearing after channel name

  //logs and transcript
  SaveTranscript: { type: Boolean, default: false },
  LogChannel: { type: String, default: null },
  LogsEnabled: { type: Boolean, default: true },

  //options
  PingSupport: { type: Boolean, default: true },
  UsersCanClose: { type: Boolean, default: true },
  UseEmojis: { type: Boolean, default: false },
  DeleteOnClose: { type: Boolean, default: true },
  SupportEmoji: { type: String, default: "🎟️" },

  //ticket message
  MesDescription: { type: String, default: "Thank you for reaching out to staff! Someone should be here with you soon! Meanwhile, please state your issues." },
  MesTitle: { type: String, default: "Hello {user}!" },
  MesColor: { type: String, default: "#990e72" },
});

module.exports = mongoose.model("tickets", Schema);
