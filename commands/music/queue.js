module.exports = {
  name: "queue",
  description: "View the music queue",
  usage: "queue",
  example: "queue",
  category: "Music",
  timeout: 2000,
  aliases: ["q"],
  async execute(client, message, _args, Discord, _emojis, colors, embeds) {
    if (!message.member.voice.channel)
      return embeds.errEmbed(
        message,
        "You need to be in a voice channel to use this command"
      );
    if (!client.distube.isPlaying(message))
      return embeds.errEmbed(message, "No songs are currently playing");

    const queueStat = client.distube.getQueue(message);

    if (!queueStat) {
      return embeds.errEmbed(message, "No songs are currently playing");
    }
    const qEmbed = new Discord.MessageEmbed()
      .setAuthor("Current Queue")
      .setDescription(
        queueStat.songs
          .map((song, id) => `**${id + 1}**. ${song.name.substr(0, 50)}`)
          .slice(0, 30)
          .join("\n")
      )
      .setColor(colors.darkPink)
      .setFooter("First 30 are shown")
    message.channel.send(qEmbed).catch((err) => {
      console.log(err.message);
    });
  },
};
