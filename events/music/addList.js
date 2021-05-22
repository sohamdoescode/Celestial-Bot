const { MessageEmbed } = require("discord.js");
const colors = require("../../design/colors");
const links = require("../../design/directLinks.json");

module.exports = (message, queue, playlist) => {
  const playListAdded = new MessageEmbed()
    .setAuthor("Playlist Added", null, playlist.url)
    .setTitle(playlist.name)
    .addField("Number of songs", playlist.songs.length, true)
    .addField("Requested by", playlist.user, true)
    .addField("Duration", playlist.formattedDuration)
    .setThumbnail(playlist.thumbnail)
    .setColor(colors.darkPink);
  message.lineReplyNoM(playListAdded).catch((err) => {
    console.log(err.message);
  });
};
