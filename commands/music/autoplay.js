module.exports = {
  name: "autoplay",
  description: "Toggle the auto-playing of songs after finishing of queue",
  usage: "autoplay",
  example: "autoplay",
  category: "Music",
  timeout: 2000,
  aliases: ["toggleautoplay"],

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

    const mode = client.distube.toggleAutoplay(message);
    embeds.sucEmbed(message, `Turned \`${mode ? "on" : "off"}\` autoplay`);
  },
};
