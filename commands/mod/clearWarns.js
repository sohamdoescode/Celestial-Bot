const warns = require("../../models/warns");
const { isMod } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "clearwarns",
  description: "Delete all infractions for a member. This cannot be undone",
  usage: "clearwarns <@user/user ID>",
  example: "clearwarns @zhue",
  category: "Moderation",
  timeout: 7000,
  aliases: ["clearinfractions", "deletewarns"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let permCheck = await isMod(client, message, "MANAGE_MESSAGES");
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

    let warnMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!warnMember || !message.guild.members.cache.has(warnMember.id))
      return embeds.errEmbed(message, "Specified user not found in the guild");

    await warns.findOne(
      { GuildID: message.guild.id, UserID: warnMember.user.id },
      async (err, data) => {
        if (err) throw err;

        if (data) {
          await warns.findOneAndDelete({
            GuildID: message.guild.id,
            UserID: warnMember.user.id,
          });
          await embeds.sucEmbed(
            message,
            `Successfully cleared warns for **${warnMember.user.tag}**`
          );
        } else {
          return embeds.errEmbed(
            message,
            `Specified user has no infractions in this guild`
          );
        }
      }
    );
  },
};
