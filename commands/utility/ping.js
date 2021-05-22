module.exports = {
  name: "ping",
  description: "Shows message and API latency",
  usage: "ping",
  example: "ping",
  category: "Utility",
  timeout: 10000,
  aliases: ["latency", "pong"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();
    const initialEmbed = new Discord.MessageEmbed()
      .setDescription(`${emojis.load} Pinging...`)
      .setColor("#36393E");
    message.channel.send(initialEmbed).then((msg) => {
      const ping = msg.createdTimestamp - message.createdTimestamp;

      let color;
      if (ping > 0 && ping < 100) color = colors.green;
      else if (ping > 100 && ping < 500) color = colors.yellow;
      else if (ping > 500) color = colors.red;

      const finalEmbed = new Discord.MessageEmbed()
        .setTitle("Pong!")
        .addField(
          `${emojis.hash} Message Latency`,
          `\`\`\`\n${ping}ms\`\`\``,
          true
        )
        .addField(
          `${emojis.globe} API Latency`,
          `\`\`\`\n${client.ws.ping}ms\`\`\``,
          true
        )
        .setColor(color)
        .setTimestamp();
      msg.edit(finalEmbed).catch((err) => {
        console.log(`${this.name} - ${err.message}`);
      });
    });
    message.channel.stopTyping();
  },
};
