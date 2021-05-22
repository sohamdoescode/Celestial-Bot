const { MessageEmbed } = require("discord.js");
const links = require("../../design/directLinks.json");
const colors = require("../../design/colors");

module.exports = (message, _queue, song) => {
  const nowPlaying = new MessageEmbed()
    .setAuthor("Added to Queue", null, song.url)
    .setTitle(song.name)
    .setThumbnail(song.thumbnail)
    .addField("Duration", song.formattedDuration, true)
    .addField("Requested by", song.user, true)
    .setColor(colors.darkPink);
  message.channel.send(nowPlaying).catch((err) => {
    console.log(err.message);
  });
};
