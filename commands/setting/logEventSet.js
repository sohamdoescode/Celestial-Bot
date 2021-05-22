const logEventsArr = require("../../utils/allLogEvents.json");
const logs = require("../../models/logs");
const {
  isBotManager
} = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "logeventset",
  description: 'Set the channel where a particular guild event is logged\nRun the "eventlist" command to get a list of all events',
  usage: "logeventset <event name> <#channel/channel ID>",
  example: "logeventset MessageBulkDelete #message-logs",
  category: "Settings",
  timeout: 4000,
  aliases: ["setlogevent"],

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
      if (!args[1])
        return embeds.errEmbed(
          message,
          "You need to specify a channel to set that event to"
        );
      let logChannel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[1]);
      if (!logChannel || !message.guild.channels.cache.has(logChannel.id))
        return embeds.errEmbed(
          message,
          "Specified channel not found in the guild"
        );

      await logs.findOne({
        GuildID: message.guild.id
      }, async (err, data) => {
        if (err) throw err;
        if (data) {
          switch (args[0]) {
            case "MessageDelete":
              data.MessageDelete.channel = logChannel.id;
              break;
            case "MessageBulkDelete":
              data.MessageBulkDelete.channel = logChannel.id;
              break;
            case "MessageUpdate":
              data.MessageUpdate.channel = logChannel.id;
              break;
            case "MemberKick":
              data.MemberKick.channel = logChannel.id;
              break;
            case "MemberBan":
              data.MemberBan.channel = logChannel.id;
              break;
            case "MemberUnban":
              data.MemberUnban.channel = logChannel.id;
              break;
            case "MemberJoinGuild":
              data.MemberJoinGuild.channel = logChannel.id;
              break;
            case "MemberLeaveGuild":
              data.MemberLeaveGuild.channel = logChannel.id;
              break;
            case "MemberJoinVoice":
              data.MemberJoinVoice.channel = logChannel.id;
              break;
            case "MemberLeaveVoice":
              data.MemberLeaveVoice.channel = logChannel.id;
              break;
            case "MemberMoveVoice":
              data.MemberMoveVoice.channel = logChannel.id;
              break;
            case "MemberAvatarUpdate":
              data.MemberAvatarUpdate.channel = logChannel.id;
              break;
            case "MemberRoleAdd":
              data.MemberRoleAdd.channel = logChannel.id;
              break;
            case "MemberRoleRemove":
              data.MemberRoleRemove.channel = logChannel.id;
              break;
            case "GuildChannelCreate":
              data.GuildChannelCreate.channel = logChannel.id;
              break;
            case "GuildChannelUpdate":
              data.GuildChannelUpdate.channel = logChannel.id;
              break;
            case "GuildChannelDelete":
              data.GuildChannelDelete.channel = logChannel.id;
              break;
            case "GuildEmojiCreate":
              data.GuildEmojiCreate.channel = logChannel.id;
              break;
            case "GuildEmojiDelete":
              data.GuildEmojiDelete.channel = logChannel.id;
              break;
            case "GuildEmojiUpdate":
              data.GuildEmojiUpdate.channel = logChannel.id;
              break;
            case "GuildRoleCreate":
              data.GuildRoleCreate.channel = logChannel.id;
              break;
            case "GuildRoleUpdate":
              data.GuildRoleUpdate.channel = logChannel.id;
              break;
            case "GuildRoleDelete":
              data.GuildRoleDelete.channel = logChannel.id;
              break;
            default:
              return;
          }

          await data.save();
          await embeds.sucEmbed(
            message,
            `Set **${args[0]}** to log in ${logChannel}. Use \`logeventon ${args[0]}\` to turn on logs for this event`
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
        `Specified event does not exist. Run \`eventlist\` to get a full list of valid events`
      );
    }
  },
};