const rf = require("randomfacts.js");

module.exports = {
  name: "randomfact",
  description: "Get a random fact",
  usage: "randomfact",
  example: "randomfact",
  category: "Fun",
  timeout: 4000,
  aliases: ["fact", "rf"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();
    rf.getRandom()
      .then((response) => {
        message.channel
          .send(
            new Discord.MessageEmbed()
              .setDescription(response.fact.toLocaleString())
              .setColor("RANDOM")
          )
          .catch(() => null);
      })
      .catch(() => null);
    message.channel.stopTyping();
  },
};
