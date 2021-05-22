const axios = require("axios");

module.exports = {
  name: "cat",
  description: "Get a random cute cat picture",
  usage: "cat",
  example: "cat",
  category: "Fun",
  timeout: 5000,
  aliases: ["catpicture", "meow", "kitty"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();
    axios
      .get("https://api.thecatapi.com/v1/images/search")
      .then((result) => {
        message.channel.send
          (
            new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setImage(result.data[0].url)
          )
          .catch(() => null);
      })
      .catch((err) => {
        console.log(err.message);
        return embeds.errEmbed(message, "Something went wrong");
      });
    message.channel.stopTyping();
  },
};
