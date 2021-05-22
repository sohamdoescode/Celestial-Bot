const logs = require("../../models/logs");
const { webhookLog } = require("../../utils/logger");
const { MessageEmbed } = require("discord.js");
const colors = require("../../design/colors");
const logIcons = require("../../design/logIcons.json");

module.exports = async (message, oldMessage, newMessage) => {

  if(!message.guild || message.author.bot) return; 

  await logs.findOne({ GuildID: message.guild.id }, async (err, data) => {
    if (err) throw err;
    if (data) {
      if (data.MessageUpdate.enabled == true) {
        const channelToLog = await message.guild.channels.cache.get(
          data.MessageUpdate.channel
        );
        if (!channelToLog) return;

        let finalContentOld;
        if (oldMessage.length > 600)
          finalContentOld = oldMessage.slice(0, 600) + "...";
        else finalContentOld = oldMessage;

        let finalContentNew;
        if (newMessage.length > 600)
          finalContentNew = newMessage.slice(0, 600) + "...";
        else finalContentNew = newMessage;

        const logEmbed = new MessageEmbed()
          .setAuthor(`Message Edited`, logIcons.edit)
          .setColor(colors.messageUpdate)
          .setDescription(
            `**Author** : ${message.author}\n**Channel** : ${message.channel}`
          )
          .setFooter(`Author ID : ${message.author.id}`)
          .addField(`Before`, finalContentOld, true)
          .addField(`After`, finalContentNew, true)
          .setTimestamp();
        webhookLog(null, channelToLog, logEmbed);
      }
    }
  });
};
