const { MessageEmbed } = require("discord.js");
const colors = require("../../design/colors");
const links = require("../../design/directLinks.json");
const emojis = require("../../design/emojis");

module.exports = (message) => {
  const emptyEmbed = new MessageEmbed()
    .setDescription(`${emojis.red} Left channel as it was empty`)
    .setColor(colors.red);
  message.channel.send(emptyEmbed).catch((err) => {
    console.log(err.message);
  });
};
