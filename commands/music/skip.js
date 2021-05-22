module.exports = {
  name: "skip",
  description: "Skip music playing in a voice channel",
  usage: "skip",
  example: "skip",
  category: "Music",
  timeout: 1000,
  aliases: ["forceskip", "fs", "s"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!message.member.voice.channel)
      return embeds.errEmbed(
        message,
        "You need to be in a voice channel to use this command"
      );
    if (!client.distube.isPlaying(message))
      return embeds.errEmbed(message, "No songs are currently playing");

    await client.distube.skip(message);
    await embeds.sucEmbed(message, "Skipped current track");
  },
};
