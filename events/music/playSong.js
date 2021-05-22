const { MessageEmbed } = require("discord.js");
const colors = require("../../design/colors");
const links = require("../../design/directLinks.json");

module.exports = (message, queue, song) => {
  const nowPlaying = new MessageEmbed()
    .setAuthor("Now Playing", links.volumeIcon, song.url)
    .setTitle(song.name)
    .setThumbnail(song.thumbnail)
    .addField("Duration", song.formattedDuration, true)
    .addField("Requested by", song.user, true)
    .setColor(colors.darkPink);
  message.channel.send(nowPlaying).catch((err) => {
    console.log(err.message);
  });
};
