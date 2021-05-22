module.exports = {
  name: "loop",
  description: "Set the current track to repeat after finish",
  usage: "loop [number]",
  example: "loop 2",
  category: "Music",
  timeout: 5000,
  aliases: ['repeat'],

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

    let loopNumber;
    if (!args[0]) {
      loopNumber = 1;
    } else {
      loopNumber = parseInt(args[0]);
    }
    if (isNaN(loopNumber)) {
      return embeds.errEmbed(
        message,
        "Number of times to loop must be a number"
      );
    }
    client.distube.setRepeatMode(message, loopNumber);
    if (loopNumber == 1) {
      return embeds.sucEmbed(message, `Set current track to loop \`1 time\``);
    } else {
      return embeds.sucEmbed(
        message,
        `Set current track to loop \`${loopNumber} times\``
      );
    }
  },
};
