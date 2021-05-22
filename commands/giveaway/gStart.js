const ms = require("ms");
// 1 DAY = 2,592,000,000 MILLISECONDS

module.exports = {
  name: "gstart",
  description: "Start a giveaway",
  usage: "gstart <#channel/channel ID> <time> <winners> <prize>",
  example: "gstart #giveaway-channel 5d 3 Nitro Classic",
  category: "Giveaways",
  timeout: 3000,
  aliases: ["giveawaystart"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!args[0])
      return embeds.infoEmbed(
        message,
        this.name,
        this.description,
        this.category,
        this.usage,
        this.example,
        this.aliases,
        this.timeout
      );

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!channel)
      return embeds.errEmbed(
        message,
        "Specified channel not found in this guild"
      );

    if (!args[1])
      return embeds.errEmbed(
        message,
        "Specify time. For eg : `2d` if you want the giveaway to last 2 days. (MAX. = 30 days)"
      );
    if (ms(args[1]) > 2592000000)
      return embeds.errEmbed(
        message,
        "Giveaways cannot last for more than 30 days"
      );
    if (ms(args[1]) < 60000)
      return embeds.errEmbed(
        message,
        "Giveaways cannot last for less than 1 minute"
      );

    if (!args[2])
      return embeds.errEmbed(message, "Missing arguments : winners");
    if (isNaN(args[2]))
      return embeds.errEmbed(message, "Winners must be a number");
    if (parseInt(args[2]) > 25)
      return embeds.errEmbed(
        message,
        "A giveaway cannot have more than 25 winners"
      );

    if (!args[3]) return embeds.errEmbed(message, "Missing arguments : prize");
    const prize = args.slice(3).join(" ");

    client.giveawaysManager
      .start(channel, {
        time: ms(args[1]),
        prize,
        embedColor: message.guild.me.displayHexColor,
        winnerCount: parseInt(args[2]),
        hostedBy: message.author,
      })
      .catch((err) => {
        console.log(err.message);
        return embeds.errEmbed(
          message,
          "Could not start the giveaway. Please try again"
        );
      });

    return embeds.sucEmbed(message, `Started the giveaway in ${channel}`);
  },
};
