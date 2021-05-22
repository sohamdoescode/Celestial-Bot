const guild = require("../../models/guild");

module.exports = {
  name: "removeallonmute",
  description:
    "If enabled, all roles from a member are removed on mute and given back when unmuted",
  usage: "removeallonmute <on/off>",
  example: "removeallonmute on",
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
          if (data.RemoveAllOnMute == true) {
            return embeds.errEmbed(
              message,
              "Removing of all roles on mute is already turned on"
            );
          } else {
            data.RemoveAllOnMute = true;
            await data.save();
            await embeds.sucEmbed(
              message,
              "Removing of all roles on mute has been successfully turned on"
            );
          }
        } else {
          const newGuild = new guild({
            GuildID: message.guild.id,
            RemoveAllOnMute: true,
          });
          await newGuild.save();
          return embeds.sucEmbed(
            message,
            "Removing of all roles on mute has been successfully turned on"
          );
        }
      });
    } else if (args[0].toLowerCase() == "off") {
      await guild.findOne({ GuildID: message.guild.id }, async (err, data) => {
        if (err) throw err;
        if (data) {
          if (data.RemoveAllOnMute == false) {
            return embeds.errEmbed(
              message,
              "Removing of all roles on mute is already turned on"
            );
          } else {
            data.RemoveAllOnMute = false;
            await data.save();
            await embeds.sucEmbed(
              message,
              "Removing of all roles on mute has been successfully turned off"
            );
          }
        } else {
          const newGuild = new guild({
            GuildID: message.guild.id,
            RemoveAllOnMute: false,
          });
          await newGuild.save();
          return embeds.sucEmbed(
            message,
            "Removing of all roles on mute has been successfully turned off"
          );
        }
      });
    }
  },
};
