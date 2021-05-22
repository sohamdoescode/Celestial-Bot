const logEventsArr = require("../../utils/allLogEvents.json");
const logs = require("../../models/logs");
const { errEmbed } = require("../../utils/functions/embeds");
const { isBotManager } = require("../../utils/functions/permissionCheck");

function alreadyTurnedOn(message, event) {
  return errEmbed(message, `Logs for **${event}** are already turned on`);
}

module.exports = {
  name: "logeventon",
  description:
    "Turn on events to be logged (Use only after setting log channels)",
  usage: "logeventon <event name>",
  example: "logeventon MessageBulkDelete",
  category: "Settings",
  timeout: 4000,
  aliases: ["onlogevent"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let permcheck = await isBotManager(client, message);
    if (permcheck == false) return embeds.permErr(message, "administrator");

    if (!args[0])
      return embeds.infoEmbed(
        message,
        this.name,
        this.description,
        this.category,
        this.usage,
        this.example,
        this.aliases,
        this.timeout
      );

    if (logEventsArr.includes(args[0])) {
      await logs.findOne({ GuildID: message.guild.id }, async (err, data) => {
        if (err) throw err;
        if (data) {
          switch (args[0]) {
            case "MessageDelete": {
              if (data.MessageDelete.enabled == true)
                return alreadyTurnedOn(message, "MessageDelete");
              data.MessageDelete.enabled = true;
              break;
            }
            case "MessageBulkDelete": {
              if (data.MessageBulkDelete.enabled == true)
                return alreadyTurnedOn(message, "MessageBulkDelete");
              data.MessageBulkDelete.enabled = true;
              break;
            }
            case "MessageUpdate": {
              if (data.MessageUpdate.enabled == true)
                return alreadyTurnedOn(message, "MessageUpdate");
              data.MessageUpdate.enabled = true;
              break;
            }
            case "MemberKick": {
              if (data.MemberKick.enabled == true)
                return alreadyTurnedOn(message, "MemberKick");
              data.MemberKick.enabled = true;
              break;
            }
            case "MemberBan": {
              if (data.MemberBan.enabled == true)
                return alreadyTurnedOn(message, "MemberBan");
              data.MemberBan.enabled = true;
              break;
            }
            case "MemberUnban": {
              if (data.MemberUnban.enabled == true)
                return alreadyTurnedOn(message, "MemberUnban");
              data.MemberUnban.enabled = true;
              break;
            }
            case "MemberJoinGuild": {
              if (data.MemberJoinGuild.enabled == true)
                return alreadyTurnedOn(message, "MemberJoinGuild");
              data.MemberJoinGuild.enabled = true;
              break;
            }
            case "MemberLeaveGuild": {
              if (data.MemberLeaveGuild.enabled == true)
                return alreadyTurnedOn(message, "MemberLeaveGuild");
              data.MemberLeaveGuild.enabled = true;
              break;
            }
            case "MemberJoinVoice": {
              if (data.MemberJoinVoice.enabled == true)
                return alreadyTurnedOn(message, "MemberJoinVoice");
              data.MemberJoinVoice.enabled = true;
              break;
            }
            case "MemberLeaveVoice": {
              if (data.MemberLeaveVoice.enabled == true)
                return alreadyTurnedOn(message, "MemberLeaveVoice");
              data.MemberLeaveVoice.enabled = true;
              break;
            }
            case "MemberMoveVoice": {
              if (data.MemberMoveVoice.enabled == true)
                return alreadyTurnedOn(message, "MemberMoveVoice");
              data.MemberMoveVoice.enabled = true;
              break;
            }
            case "MemberAvatarUpdate": {
              if (data.MemberAvatarUpdate.enabled == true)
                return alreadyTurnedOn(message, "MemberAvatarUpdate");
              data.MemberAvatarUpdate.enabled = true;
              break;
            }
            case "MemberRoleAdd": {
              if (data.MemberRoleAdd.enabled == true)
                return alreadyTurnedOn(message, "MemberRoleAdd");
              data.MemberRoleAdd.enabled = true;
              break;
            }
            case "MemberRoleRemove": {
              if (data.MemberRoleRemove.enabled == true)
                return alreadyTurnedOn(message, "MemberRoleRemove");
              data.MemberRoleRemove.enabled = true;
              break;
            }
            case "GuildChannelCreate": {
              if (data.GuildChannelCreate.enabled == true)
                return alreadyTurnedOn(message, "GuildChannelCreate");
              data.GuildChannelCreate.enabled = true;
              break;
            }
            case "GuildChannelUpdate": {
              if (data.GuildChannelUpdate.enabled == true)
                return alreadyTurnedOn(message, "GuildChannelUpdate");
              data.GuildChannelUpdate.enabled = true;
              break;
            }
            case "GuildChannelDelete": {
              if (data.GuildChannelDelete.enabled == true)
                return alreadyTurnedOn(message, "GuildChannelDelete");
              data.GuildChannelDelete.enabled = true;
              break;
            }
            case "GuildEmojiCreate": {
              if (data.GuildEmojiCreate.enabled == true)
                return alreadyTurnedOn(message, "GuildEmojiCreate");
              data.GuildEmojiCreate.enabled = true;
              break;
            }
            case "GuildEmojiDelete": {
              if (data.GuildEmojiDelete.enabled == true)
                return alreadyTurnedOn(message, "GuildEmojiDelete");
              data.GuildEmojiDelete.enabled = true;
              break;
            }
            case "GuildEmojiUpdate": {
              if (data.GuildEmojiUpdate.enabled == true)
                return alreadyTurnedOn(message, "GuildEmojiUpdate");
              data.GuildEmojiUpdate.enabled = true;
              break;
            }
            case "GuildRoleCreate": {
              if (data.GuildRoleCreate.enabled == true)
                return alreadyTurnedOn(message, "GuildRoleCreate");
              data.GuildRoleCreate.enabled = true;
              break;
            }
            case "GuildRoleUpdate": {
              if (data.GuildRoleUpdate.enabled == true)
                return alreadyTurnedOn(message, "GuildRoleUpdate");
              data.GuildRoleUpdate.enabled = true;
              break;
            }
            case "GuildRoleDelete": {
              if (data.GuildRoleDelete.enabled == true)
                return alreadyTurnedOn(message, "GuildRoleDelete");
              data.GuildRoleDelete.enabled = true;
              break;
            }
            default:
              return;
          }

          await data.save();
          await embeds.sucEmbed(
            message,
            `Turned on logs for **${args[0]}**. Make sure you use \`logeventset\` to set log channels for each event`
          );
        } else {
          const newLogSchema = new logs({
            GuildID: message.guild.id,
          });

          await newLogSchema.save();
          await embeds.sucEmbed(
            message,
            `Updated guild in database. This happens only once. Please run the command again`
          );
        }
      });
    } else {
      return embeds.errEmbed(
        message,
        `Specified event does not exist. Run \`eventlink\` to get a full list of valid events`
      );
    }
  },
};
