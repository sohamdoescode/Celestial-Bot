const catFacts = require("get-cat-facts");

module.exports = {
  name: "catfact",
  description: "Get a random facts about cats",
  usage: "catfact",
  example: "catfact",
  category: "Fun",
  timeout: 4000,
  aliases: ["cf"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();
    catFacts
      .random(1)
      .then((response) => {
        message.channel
          .send(
            new Discord.MessageEmbed()
              .setDescription(response[0].text)
              .setColor("RANDOM")
          )
          .catch(() => null);
      })
      .catch(() => null);
    message.channel.stopTyping();
  },
};
