module.exports = {
  name: "pollresult",
  description: "View the result of a poll made using the bot",
  usage: "pollresult <#channel/channel ID> <message ID>",
  example: "pollresult #polls 822860043384651816",
  category: "Moderation",
  timeout: 6000,
  aliases: ["pollevaluate", "polleval"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!args[0])
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

    const channel =
      message.guild.channels.cache.get(args[0]) ||
      message.mentions.channels.first();
    if (!channel || !message.guild.channels.cache.has(channel.id))
      return embeds.errEmbed(
        message,
        "Specified channel could not be found in the guild"
      );

    if (!args[1])
      return embeds.errEmbed(
        message,
        "You need to mention the ID of the message of the poll you want to view results for"
      );
    if (isNaN(args[1]))
      return embeds.errEmbed(
        message,
        "Message ID of the poll should be a number"
      );
    if (parseInt(args[1]) > 9223372036854775807)
      return embeds.errEmbed(message, "Specified message could not be found");

    const fetched = await channel.messages.fetch(args[1]).catch((err) => {
      if (err.httpStatus == 404)
        return embeds.errEmbed(message, "No such message exists");
    });

    if (fetched == null || !fetched) return;
    if (fetched.author.id !== client.user.id)
      return embeds.errEmbed(message, "That is not a poll message");
    console.log(fetched.reactions.cache.array())

    const finalEmbed = new Discord.MessageEmbed()
      .setTitle("Poll result")
      .setColor(colors.darkPink)
      .setFooter(`Requested by ${message.author.tag}`)
      .setTimestamp();
    // 9223372036854775807
    const arr = ["🇦", "🇧", "🇨", "🇩", "🇪"];

    arr.forEach((reaction) => {
      if (fetched.reactions.cache.has(reaction)) {
        finalEmbed.addField(
          `Option ${reaction}`,
          `> \`${fetched.reactions.cache.get(reaction).count - 1} vote(s)\``,
          true
        );
      }
    });

    await message.lineReplyNoMention(finalEmbed).catch((err) => {
      console.log(err.message);
    });
  },
};
