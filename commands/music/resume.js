module.exports = {
  name: "resume",
  description: "Resume guild playback (if paused)",
  usage: "resume",
  example: "resume",
  category: "Music",
  timeout: 4000,
  aliases: [],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!message.member.voice.channel)
      return embeds.errEmbed(
        message,
        "You need to be in a voice channel to use this command"
      );

    if (client.distube.isPaused(message) === false) {
      return embeds.errEmbed(message, "Guild playback is not paused")
    }
    client.distube.resume(message)
    message.react("⏯️").catch(() => null)
  },
};