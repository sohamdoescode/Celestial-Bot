module.exports = {
  name: "vaporwave",
  description: "Toggle the vaporwave filter for music",
  usage: "vaporwave",
  example: "vaporwave",
  category: "Music",
  timeout: 2000,
  aliases: ["vaporwavefilter", "vapourwave", "vapourwavefilter"],

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

    const filter = await client.distube.setFilter(message, "vaporwave");
    await embeds.sucEmbed(
      message,
      `Current queue filter : ${filter || "`Off`"}`
    );
  },
};
