module.exports = {
  name: "stop",
  description: "Stop music playing in a voice channel",
  usage: "stop",
  example: "stop",
  category: "Music",
  timeout: 500,
  aliases: ["stop", "leave"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!message.member.voice.channel)
      return embeds.errEmbed(
        message,
        "You need to be in a voice channel to use this command"
      );
    if (!client.distube.isPlaying(message))
      return embeds.errEmbed(message, "No songs are currently playing");

    await client.distube.stop(message);
    await embeds.sucEmbed(message, "Stopped playback");
  },
};
