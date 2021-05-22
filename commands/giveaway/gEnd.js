module.exports = {
  name: "gend",
  description: "End a giveaway before automatic end",
  usage: "gend <message ID>",
  example: "gend 822860043384651816",
  category: "Giveaways",
  timeout: 5000,
  aliases: ["giveawayend", "endgiveaway"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!args[0]) {
      return embeds.infoEmbed(
        message,
        this.name,
        this.description,
        this.category,
        this.usage,
        this.example,
        this.aliases,
        this.timeout
      );
    }

    if (isNaN(args[0])) {
      return embeds.errEmbed(message, "Message ID can only be a number");
    }
    let gawExists = client.giveawaysManager.giveaways.find(
      (g) => g.guildID === message.guild.id && g.messageID === args[0]
    )
    if (!gawExists) {
      return embeds.errEmbed(message, `No giveaway found on message with ID : \`${args[0]}\``)
    }
    client.giveawaysManager.end(args[0])
      .then(() => {
        return embeds.sucEmbed(
          message,
          `Ended giveaway with ID : \`${args[0]}\``
        );
      })
      .catch(() => {
        return embeds.errEmbed(
          message,
          `No giveaway found on message with ID : \`${args[0]}\``
        );
      });
  },
};