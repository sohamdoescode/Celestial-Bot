const logs = require("../../models/logs");
const { webhookLog } = require("../../utils/logger");
const { MessageEmbed } = require("discord.js");
const colors = require("../../design/colors");
const logIcons = require("../../design/logIcons.json");

module.exports = async (client, message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  await logs.findOne({ GuildID: message.guild.id }, async (err, data) => {
    if (err) throw err;

    if (data) {
      if (data.MessageDelete.enabled == true) {
        const channelToLog = await message.guild.channels.cache.get(
          data.MessageDelete.channel
        );
        if (!channelToLog) return;

        let finalContent;
        if (message.content.length > 1000)
          finalContent = message.content.slice(0, 1000) + "...";
        else finalContent = message.content;

        const logEmbed = new MessageEmbed()
          .setAuthor(`Message Deleted`, logIcons.bin)
          .setColor(colors.messageDelete)
          .setDescription(
            `**Author** : ${message.author}\n**Channel** : ${message.channel}\n\n**Content** :\n${finalContent}`
          )
          .setFooter(`Author ID : ${message.author.id}`)
          .setTimestamp();
        webhookLog(client, channelToLog, logEmbed);
      }
    }
  });
};
