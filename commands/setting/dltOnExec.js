const guild = require("../../models/guild");
const { isBotManager } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "dltonexec",
  description: "Toggle deletion of moderation commands on execution",
  usage: "dltonexec <on/off>",
  example: "dltonexec on",
  category: "Settings",
  timeout: 7000,
  aliases: ["deleteonexec", "deleteonexecution"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let permCheck = await isBotManager(client, message);
    if (permCheck == false) {
      return embeds.permErr(message, "administrator");
    }
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
    if (args[0].toLowerCase() === "on") {
      await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
        if (err) {
          throw err;
        }
        if (data) {
          if (data.DeleteOnExec == true) {
            return embeds.errEmbed(
              message,
              "Deletion of mod-commands on execution is already enabled"
            );
          } else {
            data.DeleteOnExec = true;
            await data.save();
            return embeds.sucEmbed(
              message,
              "Deletion of mod-commands on execution successfully enabled"
            );
          }
        } else {
          let newSch = new guild({
            GuildID: message.guild.id,
            DeleteOnExec: true,
          });
          await newSch.save();
          await embeds.sucEmbed(
            message,
            "Deletion of mod-commands on execution successfully enabled"
          );
        }
      });
    } else if (args[0].toLowerCase() === "off") {
      await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
        if (err) {
          throw err;
        }
        if (data) {
          if (data.DeleteOnExec == false) {
            return embeds.errEmbed(
              message,
              "Deletion of mod-commands on execution is already disabled"
            );
          } else {
            data.DeleteOnExec = false;
            await data.save();
            return embeds.sucEmbed(
              message,
              "Deletion of mod-commands on execution successfully disabled"
            );
          }
        } else {
          let newSch = new guild({
            GuildID: message.guild.id,
            DeleteOnExec: false,
          });
          await newSch.save();
          await embeds.sucEmbed(
            message,
            "Deletion of mod-commands on execution successfully disabled"
          );
        }
      });
    } else {
      return embeds.errEmbed(message, "Invalid sub-commands provided");
    }
  },
};
