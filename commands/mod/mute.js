const ms = require('ms')

module.exports = {
  name: "mute",
  description: "Temporarily prevent a user from sending messages",
  usage: "mute <@user/user ID> [time] [reason]",
  example: "mute @zhue Spamming",
  category: "Moderation",
  timeout: 3000,
  aliases: ["shush"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!args[0]) {
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
    }
    const toMute =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if(!toMute) {
      return embeds.errEmbed(message, "Specified user not found in the guild")
    }
    let time; 
    let reason; 
    if(args[1]) {
      if(isNaN(ms(args[1]))) {
        reason = args.slice(1).join(" ")
        time = null
      } else {
        time = ms(args[1])
        if(args[2]) {
          reason = args.slice(2).join(" ")
        } else {
          reason = "No reason stated"
        }
      }
    } else {
      reason = "No reason stated"
      time = null
    }
  },
};