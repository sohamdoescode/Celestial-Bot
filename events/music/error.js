const { MessageEmbed } = require("discord.js");
const colors = require("../../design/colors");
const emojis = require("../../design/emojis");

module.exports = (message, err) => {
  const errEmbed = new MessageEmbed()
    .addField(`${emojis.cross} Error`, err)
    .setColor(colors.red);
  message.channel.send(errEmbed).catch((err) => {
    console.log(err.message);
  });
};
