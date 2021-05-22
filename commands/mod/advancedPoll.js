const {
  isMod
} = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "advancedpoll",
  description: "Create an advanced poll in the current channel with multiple options (max 5)",
  usage: "advancedpoll <topic>,<option 1>,<option 2>,[option 3],[option 4],[option 5]",
  example: "advancedpoll Favorite Fruit,apples,bananas,oranges",
  category: "Moderation",
  timeout: 3000,
  aliases: ["ap", "complexpoll", "multipoll"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const permCheck = await isMod(client, message, "MANAGE_MESSAGES");

    if (permCheck == false) return embeds.permErr(message, "manage_messages");

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

    const total = args.slice(0).join(" ");
    const spiltted = total.split(",");

    if (!spiltted[0] || !spiltted[1] || !spiltted[2]) {
      return embeds.errEmbed(
        message,
        "The title, option 1 and option 2 are required"
      );
    }

    let pollTitle;
    const finalArr = [];
    const emojiArr = [];

    if (spiltted[0]) {
      pollTitle = spiltted[0];
    }
    if (spiltted[1]) {
      finalArr.push(`🇦 : ${spiltted[1].trim()}`);
      emojiArr.push("🇦");
    }
    if (spiltted[2]) {
      finalArr.push(`🇧 : ${spiltted[2].trim()}`);
      emojiArr.push("🇧");
    }
    if (spiltted[3]) {
      finalArr.push(`🇨 : ${spiltted[3].trim()}`);
      emojiArr.push("🇨");
    }
    if (spiltted[4]) {
      finalArr.push(`🇩 : ${spiltted[4].trim()}`);
      emojiArr.push("🇩");
    }
    if (spiltted[5]) {
      finalArr.push(`🇪 : ${spiltted[5].trim()}`);
      emojiArr.push("🇪");
    }
    if (spiltted[6]) {
      return embeds.errEmbed(message, "A poll can have a maximum of 5 options");
    }

    await message.delete().catch((err) => console.log(err));

    await message.channel
      .send({
        embed: new Discord.MessageEmbed()
          .setAuthor(spiltted[0])
          .setDescription(finalArr.join("\n\n"))
          .setColor(colors.darkPink)
          .setTimestamp()
          .setFooter(`Poll by ${message.author.tag}`),
      })
      .then(async (msg) => {
        emojiArr.forEach(async (reaction) => {
          await msg.react(reaction).catch(console.error);
        });
      })
      .catch((err) => {
        message.channel.send(err.message).catch(console.error);
      });
  },
};