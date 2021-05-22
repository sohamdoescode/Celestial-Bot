const guild = require("../../models/guild");
const { isBotManager } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "setprefix",
  description: "Set the prefix for the current guild (default : ??)",
  usage: "setprefix <prefix>",
  example: "setprefix !",
  category: "Settings",
  timeout: 4000,
  aliases: ["changeprefix"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let permcheck = await isBotManager(client, message);
    if (permcheck == false) return embeds.permErr(message, "administrator");

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

    await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
      if (err) return embeds.errEmbed(message, err.message);

      if (data) {
        // prefix is already set to specified
        if (data.Prefix == args[0])
          return embeds.errEmbed(
            message,
            "Specified is already set as current prefix"
          );
        if (args[0].length > 5)
          return embeds.errEmbed(
            message,
            "The prefix cannot be more than 5 characters long"
          );

        data.Prefix = args[0];
        await data.save();

        embeds.sucEmbed(message, `Successfully changed prefix to ${args[0]}`);
      } else {
        if (args[0].length > 5)
          return embeds.errEmbed(
            message,
            "The prefix cannot be more than 5 characters long"
          );

        const newSchema = new guild({
          GuildID: message.guild.id,
          Prefix: args[0],
        });
        await newSchema.save();

        embeds.sucEmbed(message, `Successfully changed prefix to ${args[0]}`);
      }
    });

    if (prefixCache.has(message.guild.id)) {
      prefixCache.delete(message.guild.id);
      prefixCache.set(message.guild.id, args[0]);
    }
  },
};
