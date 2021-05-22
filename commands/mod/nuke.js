const links = require("../../design/directLinks.json");
const { isMod, isAdmin } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "nuke",
  description: "Delete all messages in a channel",
  usage: "nuke",
  example: "nuke",
  category: "Moderation",
  timeout: 10000,
  aliases: ["boom"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const permCheck = await isAdmin(client, message);
    if (permCheck == false) return embeds.permErr(message, "administrator");

    if (message.channel.id == message.guild.publicUpdatesChannelID)
      return embeds.errEmbed(
        message,
        "Cannot nuke a channel required for community servers"
      );
    if (message.channel.id == message.guild.embedChannelID)
      return embeds.errEmbed(
        message,
        "Cannot nuke a channel required for community servers"
      );
    if (message.channel.id == message.guild.rulesChannelID)
      return embeds.errEmbed(
        message,
        "Cannot nuke a channel required for community servers"
      );
    if (message.channel.id == message.guild.systemChannelID)
      return embeds.errEmbed(
        message,
        "Cannot nuke a channel required for community servers"
      );
    if (message.channel.id == message.guild.widgetChannelID)
      return embeds.errEmbed(
        message,
        "Cannot nuke a channel required for community servers"
      );

    const cloned = await message.channel
      .clone()
      .catch((err) => console.log(err));
    await message.channel.delete().catch((err) => console.log(err));

    await cloned
      .setParent(message.channel.parentID)
      .catch((err) => console.log(err));
    await cloned
      .setPosition(message.channel.rawPosition)
      .catch((err) => console.log(err));
    await cloned
      .overwritePermissions(message.channel.permissionOverwrites)
      .catch((err) => console.log(err));

    const nukedEmbed = new Discord.MessageEmbed()
      .setImage(links.nukedGif)
      .setTitle(`${message.author.username} nuked this channel`)
      .setTimestamp()
      .setColor(colors.darkPink);

    await cloned.send(nukedEmbed).catch((err) => console.log(err));
  },
};
