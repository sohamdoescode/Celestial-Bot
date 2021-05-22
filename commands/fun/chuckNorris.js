const Chuck = require("chucknorris-io");
const chuckClient = new Chuck();

module.exports = {
  name: "chucknorris",
  description: "Get a random Chuck Norris joke",
  usage: "chucknorris",
  example: "chucknorris",
  category: "Fun",
  timeout: 2000,
  aliases: ["chuck"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();

    chuckClient.getRandomJoke().then((joke) => {
      message.channel
        .send(
          new Discord.MessageEmbed()
            .setDescription(joke.value)
            .setThumbnail(joke.iconURL)
            .setColor("RANDOM")
        )
        .catch((err) => {
          embeds.errEmbed(message, err.message);
        });
    });

    message.channel.stopTyping();
  },
};
