const mongoose = require("mongoose");

let defaultLog = {
  enabled: { type: Boolean, default: false },
  channel: { type: String, default: null },
};

let Schema = new mongoose.Schema({
  GuildID: { type: String, default: null, required: true },

  ModLogs: { type: String, default: null },

  IgnoreChannels: { type: Array, default: [] },
  IgnoreRoles: { type: Array, default: [] },

  MessageDelete: defaultLog,
  MessageBulkDelete: defaultLog,
  MessageUpdate: defaultLog,
  MemberKick: defaultLog,
  MemberBan: defaultLog,
  MemberUnban: defaultLog,
  MemberJoinGuild: defaultLog,
  MemberLeaveGuild: defaultLog,
  MemberJoinVoice: defaultLog,
  MemberLeaveVoice: defaultLog,
  MemberMoveVoice: defaultLog,
  MemberAvatarUpdate: defaultLog,
  MemberRoleAdd: defaultLog,
  MemberRoleRemove: defaultLog,
  GuildChannelCreate: defaultLog,
  GuildChannelDelete: defaultLog,
  GuildChannelUpdate: defaultLog,
  GuildEmojiCreate: defaultLog,
  GuildEmojiDelete: defaultLog,
  GuildEmojiUpdate: defaultLog,
  GuildRoleCreate: defaultLog,
  GuildRoleDelete: defaultLog,
  GuildRoleUpdate: defaultLog,
});

module.exports = mongoose.model("logs", Schema);
