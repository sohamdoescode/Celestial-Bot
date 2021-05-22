const mongoose = require("mongoose");


const schema = new mongoose.Schema({
  //Id of the server ================>
  GuildID: {
    type: mongoose.SchemaTypes.String,
    default: null,
    required: true
  },

  //Role restrictions ===============>

  //No mod action can be taken on users with these roles
  ProtectedRoles: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Users with any of these roles have access to all mod commands
  ModRoles: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Users with any of these roles have access to all admin commands
  AdminRoles: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Users with any of these roles can MANAGE ANYTHING in the bot, except the setting itself
  BotManagers: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Other Roles ===============>

  //Used for locking down channels and such
  DefaultRoles: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Roles removed from a user when muted 
  RemoveOnMute: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Given to users on mute
  MuteRole: {
    type: mongoose.SchemaTypes.String,
    default: null
  },

  //Restrict music commands to
  DjRole: {
    type: mongoose.SchemaTypes.String,
    default: null
  },

  //Planned feature in the future
  RainbowRole: {
    type: mongoose.SchemaTypes.String,
    default: null
  },

  //Settings ===============>

  //Whether all roles are removed on mute
  RemoveAllOnMute: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Whether to dm users on moderation actions
  DmOnMod: {
    type: mongoose.SchemaTypes.Boolean,
    default: true
  },

  //Whether to delete mod commands when executed
  DeleteOnExec: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Whether to delete confirmation msg after a timeout (mod commands only)
  DeleteModResponse: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Prompt with missing reason when none is provided
  RequireReason: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Kick new accounts on join if enabled
  RaidMode: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Restrict Music Commands to only DJ Role
  RestrictMusic: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Channel where suggestions are sent
  SuggestionChannel: {
    type: mongoose.SchemaTypes.String,
    default: null
  },

  //Whether suggestions are anonymous
  AnonymousSuggestions: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Other Data ===============>

  //Whether guild is blacklisted
  Blacklisted: {
    type: mongoose.SchemaTypes.Boolean,
    default: false
  },

  //Prefix for the guild
  Prefix: {
    type: mongoose.SchemaTypes.String,
    default: null
  },

  //Moderation Cases 
  ModCases: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Custom Commands : (Starting with Prefix, not triggers)
  CustomCommands: {
    type: mongoose.SchemaTypes.Array,
    default: []
  },

  //Commands which are disabled
  DisabledCommands: {
    type: mongoose.SchemaTypes.Array,
    default: []
  }

})

module.exports = mongoose.model("guild", schema);