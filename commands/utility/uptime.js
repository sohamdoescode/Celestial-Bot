const ms = require('ms'); 

module.exports = {
  name: "uptime",
  description: "Shows how long Celestial has been online for",
  usage: "uptime",
  example: "uptime",
  category: "Utility",
  timeout: 2000,
  aliases: [],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.lineReplyNoMention(
      new Discord.MessageEmbed()
      .setTitle("Client Uptime")
      .addField(`Uptime`, "`"+ms(client.uptime, {long : true})+"`")
      .addField(`Last Restart`, "`"+lastRestart+"`")
      .setColor(colors.darkPink)
      .setTimestamp()
    ).catch(()=> null)
  },
};