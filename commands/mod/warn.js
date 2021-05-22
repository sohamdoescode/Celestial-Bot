const {
  isMod
} = require("../../utils/functions/permissionCheck");
const warns = require("../../models/warns");
let now = new Date();
const guild = require("../../models/guild");

module.exports = {
  name: "warn",
  description: "Warn a user through DMs and increase number of warns",
  usage: "warn <@user/user ID> <reason>",
  example: "warn @zhue Links in general chat",
  category: "Moderation",
  timeout: 2000,
  aliases: ["strike"],

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

    let warnMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!warnMember || !message.guild.members.cache.has(warnMember.id))
      return embeds.errEmbed(message, "Specified user not found in the guild");
    if (warnMember.user.bot)
      return embeds.errEmbed(message, "Cannot warn a bot");
    if (warnMember.user.id == message.author.id)
      return embeds.errEmbed(message, "You cannot warn yourself");
    if (
      warnMember.roles.highest.position >=
      message.member.roles.highest.position &&
      message.guild.ownerID !== message.author.id
    )
      return embeds.errEmbed(
        message,
        "You can only warn members with highest roles placed lower than your highest role"
      );
    if (
      warnMember.hasPermission("ADMINISTRATOR") ||
      message.guild.ownerID == warnMember.user.id
    )
      return embeds.errEmbed(message, "Cannot warn that member");

    if (!args[1])
      return embeds.errEmbed(message, "You have to specify a reason to warn");
    let reason = args.slice(1).join(" ");

    warnMember
      .send(
        new Discord.MessageEmbed()
        .addField(
          `${emojis.mod} You have been warned`,
          `in **${message.guild.name}** for **${reason}**`
        )
        .setTimestamp()
        .setColor(colors.darkPink)
      )
      .catch(() => null);

    await warns.findOne({
        GuildID: message.guild.id,
        UserID: warnMember.user.id
      },
      async (err, data) => {
        if (err) throw err;

        if (data) {
          data.WarnCount = data.WarnCount + 1;
          data.WarnCases.unshift({
            warnedUser: warnMember.user.tag,
            time: `\`${now.toLocaleDateString()} - ${now.toLocaleTimeString()}\``,
            mod: message.author.tag,
            reason: reason,
          });

          await data.save();
        } else {
          let newSchema = new warns({
            GuildID: message.guild.id,
            UserID: warnMember.user.id,
            WarnCount: 1,
            WarnCases: [{
              warnedUser: warnMember.user.tag,
              time: `\`${now.toLocaleDateString()} - ${now.toLocaleTimeString()}\``,
              mod: message.author.tag,
              reason: reason,
            }, ],
          });

          await newSchema.save();
        }
      }
    );

    let dltOnExec = false;
    let dltModResponse = false;

    await guild.findOne({
      GuildID: message.guild.id
    }, async (err, data) => {
      if (err) throw err;

      if (data) {
        if (data.DeleteOnExec == true) {
          message.delete().catch(() => null);
        }
        let suc = await embeds.sucEmbed(
          message,
          `Warned **${warnMember.user.tag}** for **${reason}**`
        );
        if (data.DeleteModResponse == true) {
          setTimeout(() => {
            suc.delete().catch(() => null);
          }, 7000);
        }
      }
    });

  },
};