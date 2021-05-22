module.exports = {
  name: "pause",
  description: "Pause current guild playback",
  usage: "pause",
  example: "pause",
  category: "Music",
  timeout: 4000,
  aliases: [],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!message.member.voice.channel)
    return embeds.errEmbed(
      message,
      "You need to be in a voice channel to use this command"
    );

    if(client.distube.isPaused(message) === true) {
      return embeds.errEmbed(message, "Guild playback is already paused. Use `resume` to resume")
    }
    client.distube.pause(message)
    message.react("⏸️").catch(()=> null)
  },
};