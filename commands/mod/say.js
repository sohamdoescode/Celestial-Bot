const guild = require("../../models/guild");

module.exports = {
  name: "say",
  description: "Make an announcement in a channel",
  usage: "say <#channel/channel ID> <message>",
  example:
    "say #general Hello there!\nsay #news We're revamping!\nsay #updates {everyone} Hey everyone!\nsay #announce {here} Vote below!",
  category: "Moderation",
  timeout: 2000,
  aliases: ["announce"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let permCheck = false;
    if (message.author.id == message.guild.ownerID) permCheck = true;

    await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
      if (err) throw err;

      if (data) {
        if (data.ModRoles.length) {
          for (let i = 0; i <= data.ModRoles.length; i++) {
            if (message.member.roles.cache.has(data.ModRoles[i])) {
              permCheck = true;
            }
          }
        }
        if (
          message.member.hasPermission("ADMINISTRATOR") ||
          message.member.hasPermission("MANAGE_MESSAGES")
        ) {
          permCheck = true;
        }
      } else if (
        message.member.hasPermission("ADMINISTRATOR") ||
        message.member.hasPermission("MANAGE_MESSAGES")
      ) {
        permCheck = true;
      }
    });

    if (permCheck == false) return embeds.permErr(message, "kick_members");

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

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!channel)
      return embeds.errEmbed(
        message,
        "Specified channel could not be found in the guild"
      );
    if (!message.guild.channels.cache.has(channel.id))
      return embeds.errEmbed(
        message,
        "Specified channel could not be found in the guild"
      );

    if (!args[1])
      return embeds.errEmbed(
        message,
        "You need to specify a message to announce"
      );
    let messageToPost = args.slice(1).join(" ");

    if (messageToPost.includes("{everyone}")) {
      if (
        !message.member.hasPermission("MENTION_EVERYONE") &&
        message.author.id !== message.guild.ownerID &&
        !message.member.hasPermission("ADMINISTRATOR")
      ) {
        return embeds.errEmbed(
          message,
          "You do not have the `MENTION_EVERYONE` permission. Hence the `{everyone}` and `{here}` tag will not work"
        );
      }
      messageToPost = messageToPost.replace("{everyone}", "@everyone");
    }

    if (messageToPost.includes("{here}")) {
      if (
        !message.member.hasPermission("MENTION_EVERYONE") &&
        message.author.id !== message.guild.ownerID &&
        !message.member.hasPermission("ADMINISTRATOR")
      ) {
        return embeds.errEmbed(
          message,
          "You do not have the `MENTION_EVERYONE` permission. Hence the `{everyone}` and `{here}` tag will not work"
        );
      }
      messageToPost = messageToPost.replace("{here}", "@here");
    }

    channel.send(messageToPost).catch((err) => console.log(err));
    return embeds.sucEmbed(message, `Announcement posted in ${channel}`);
  },
};
