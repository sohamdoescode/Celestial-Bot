const guild = require("../../models/guild");

module.exports = {
  name: "requirereason",
  description:
    "If enabled, a reason prompt is sent on mod actions if none specified",
  usage: "requirereason <on/off>",
  example: "requirereason on",
  category: "Settings",
  timeout: 7000,
  aliases: [],
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
    if (args[0].toLowerCase() == "on") {
      await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
        if (err) throw err;
        if (data) {
          if (data.RequireReason == true) {
            return embeds.errEmbed(
              message,
              "Reason prompt on mod actions is already turned on"
            );
          } else {
            data.RequireReason = true;
            await data.save();
            await embeds.sucEmbed(
              message,
              "Reason prompts have successfully been turned on"
            );
          }
        } else {
          const newGuild = new guild({
            GuildID: message.guild.id,
            RequireReason: true,
          });
          await newGuild.save();
          return embeds.sucEmbed(
            message,
            "Reason prompts have successfully been turned on"
          );
        }
      });
    } else if (args[0].toLowerCase() == "off") {
      await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
        if (err) throw err;
        if (data) {
          if (data.RequireReason == false) {
            return embeds.errEmbed(
              message,
              "Reason prompt on mod actions is already turned off"
            );
          } else {
            data.RequireReason = false;
            await data.save();
            await embeds.sucEmbed(
              message,
              "Reason prompts have successfully been turned off"
            );
          }
        } else {
          const newGuild = new guild({
            GuildID: message.guild.id,
            RequireReason: false,
          });
          await newGuild.save();
          return embeds.sucEmbed(
            message,
            "Reason prompts have successfully been turned off"
          );
        }
      });
    }
  },
};
