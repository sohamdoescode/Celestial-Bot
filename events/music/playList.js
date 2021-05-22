const { MessageEmbed } = require("discord.js");
const colors = require("../../design/colors");
const links = require("../../design/directLinks.json");

module.exports = (message, queue, playlist, song) => {
  const playListAdded = new MessageEmbed()
    .setAuthor("Playlist Added", null, playlist.url)
    .setTitle(playlist.name)
    .addField("Number of songs", playlist.songs.length, true)
    .addField("Requested by", song.user, true)
    .addField("Duration", playlist.formattedDuration)
    .setThumbnail(song.thumbnail)
    .setColor(colors.darkPink);
  message.channel.send(playListAdded).catch((err) => {
    console.log(err.message);
  });
};
