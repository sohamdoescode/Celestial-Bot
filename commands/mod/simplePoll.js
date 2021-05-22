module.exports = {
  name: "simplepoll",
  description:
    "Create a simple poll in the current channel with a single statement",
  usage: "simplepoll <sentence>",
  example: "simplepoll Movie night today?",
  category: "Moderation",
  timeout: 1000,
  aliases: ["poll"],
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

    try {
      await message.delete().catch((err) => {
        console.log(err.message);
      });
      await message.channel
        .send(
          new Discord.MessageEmbed()
            .setAuthor(`${message.author.tag} asks :`)
            .setDescription(args.slice(0).join(" "))
            .setColor(colors.darkPink)
        )
        .then(async (m) => {
          await m.react("👍").catch((err) => {
            console.log(err.message);
          });
          await m.react("👎").catch((err) => {
            console.log(err.message);
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err.message);
    }
  },
};
