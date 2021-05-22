const dig = require("discord-image-generation");

module.exports = {
  name: "invert",
  description: "Invert the color of someone's avatar",
  usage: "invert [user]",
  example: "invert @zhue",
  category: "Fun",
  timeout: 8000,
  aliases: ["invertcolors"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();
    let toInvert;
    let avatar;
    if (args[0]) {
      toInvert =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!toInvert) {
        return embeds.errEmbed(
          message,
          "Specified user not found in the guild"
        );
      }
      avatar = toInvert.user.displayAvatarURL({
        dynamic: false,
        format: "png",
        size: 1024,
      });
    } else {
      toInvert = message.author;
      avatar = message.author.displayAvatarURL({
        dynamic: false,
        format: "png",
        size: 1024,
      });
    }
    let processedImg = await new dig.Invert().getImage(avatar);
    let attach = new Discord.MessageAttachment(processedImg, "inverted.png");
    await message.lineReplyNoMention(attach).catch(() => null);
    message.channel.stopTyping();
  },
};
