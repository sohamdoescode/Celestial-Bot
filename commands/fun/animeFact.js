const AnimeFacts = require('anime-facts')
const config = require('../../config/bot-settings.json')
const animeApi = new AnimeFacts(config.animuKey)

module.exports = {
  name: "animefact",
  description: "Get a random fact, but specifically about anime",
  usage: "animefact",
  example: "animefact",
  category: "Fun",
  timeout: 8000,
  aliases: ["af"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();
    animeApi.getFact(null, 1, 400).then((res) => {
      message.channel.send(
        new Discord.MessageEmbed()
        .setDescription(res.fact.toLocaleString())
        .setColor("RANDOM")
      ).catch(() => null)
    }).catch((err) => {
      embeds.errEmbed(message, err)
    })
    message.channel.stopTyping();
  },
};