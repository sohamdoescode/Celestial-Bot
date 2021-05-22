const guild = require("../../models/guild");
const allCat = require("../../utils/allCategories.json");
const { isBotManager } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "disable",
  description: "Disable a command or category",
  usage:
    "disable <command name/category name>\nNote : Category names are case sensitive",
  example: "disable kick",
  category: "Settings",
  timeout: 5000,
  aliases: [],
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

    const protectedCommands = [
      "enable",
      "disable",
      "toggle",
      "disabledlist",
      "disabled",
      "settings",
    ];

    if (
      !client.commands.has(args[0].toLowerCase()) &&
      !allCat.includes(args[0])
    )
      return embeds.errEmbed(
        message,
        "That is not a valid command or category. *Note : category names are case sensitive*"
      );
    if (protectedCommands.includes(args[0].toLowerCase()))
      return embeds.errEmbed(
        message,
        "Specified command/category is protected and cannot be disabled!"
      );

    await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
      if (err) throw err;

      if (data) {
        if (data.DisabledCommands.includes(args[0])) {
          return embeds.errEmbed(
            message,
            "Specified command/category is already disabled"
          );
        }

        await data.DisabledCommands.push(args[0]);
        await data.save();
        await embeds.sucEmbed(message, `Successfully disabled **${args[0]}**`);
      } else {
        const newSchema = new guild({
          GuildID: message.guild.id,
          DisabledCommands: [args[0]],
        });

        await newSchema.save();
        await embeds.sucEmbed(message, `Successfully disabled **${args[0]}**`);
      }
    });
  },
};
