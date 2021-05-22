const warns = require("../../models/warns");
const {
  isMod
} = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "warns",
  description: 'View infractions for a user. Not to be confused with "warn". Also shows most recent cases along with moderator tags.',
  usage: "warns <@user/user ID>",
  example: "warns @zhue",
  category: "Moderation",
  timeout: 6000,
  aliases: ["infractions"],

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
      return embeds.errEmbed(
        message,
        "Specified user could not be found in the guild"
      );

    await warns.findOne({
        GuildID: message.guild.id,
        UserID: warnMember.user.id
      },
      async (err, data) => {
        if (err) throw err;

        if (data) {
          let tempArr = [];

          data.WarnCases.forEach((c) => {
            tempArr.push(
              `- \`${c.time}\` - **${c.mod}** - *${c.reason.slice(0, 15)}*`
            );
          });
          const embed = new Discord.MessageEmbed()
            .setTitle(`${warnMember.user.username}'s Infractions`)
            .setDescription(
              `> ${warnMember.user.tag} currently has \`${data.WarnCount}\` infractions in this guild`
            )
            .addField(
              `${emojis.timeout} Last three infractions`,
              tempArr.slice(0, 3)
            )
            .setColor(colors.darkPink)
            .setTimestamp()
            .setFooter(
              `Reasons may be sliced | Use "warnslist" to view all infractions`
            );
          message.lineReplyNoMention(embed).catch(() => null);
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