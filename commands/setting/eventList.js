const listArr = require("../../utils/allLogEvents.json");

module.exports = {
  name: "eventlist",
  description: "List of all events loggable by Celestial",
  usage: "eventlist",
  example: "eventlist",
  category: "Settings",
  timeout: 2000,
  aliases: ["listevents"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message
      .lineReplyNoMention(
        new Discord.MessageEmbed()
          .setTitle("Loggable Events List")
          .setDescription(`\`\`\`\n${listArr.join("\n")}\`\`\``)
          .setColor(colors.darkPink)
          .setFooter(`Note : Event names are case sensitive`)
      )
      .catch(() => null);
  },
};
