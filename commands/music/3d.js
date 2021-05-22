module.exports = {
  name: "3d",
  description: "Toggle the 3d filter for music",
  usage: "3d",
  example: "3d",
  category: "Music",
  timeout: 2000,
  aliases: ["3dfilter"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!message.member.voice.channel)
      return embeds.errEmbed(
        message,
        "You need to be in a voice channel to use this command"
      );

    const queueStat = client.distube.getQueue(message);

    if (!queueStat) {
      return embeds.errEmbed(message, "No songs are currently playing");
    }

    const filter = await client.distube.setFilter(message, "3d");
    await embeds.sucEmbed(
      message,
      `Current queue filter : ${filter || "`Off`"}`
    );
  },
};
