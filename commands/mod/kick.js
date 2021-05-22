const guild = require("../../models/guild");
const {
  webhookLog
} = require("../../utils/logger");
const logs = require("../../models/logs");

const now = new Date();
const {
  isMod
} = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "kick",
  description: "Remove a member from the guild",
  usage: "kick <@user/user ID> [reason]",
  example: "kick @zhue breaking rules",
  category: "Moderation",
  timeout: 2000,
  aliases: ["k"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const permCheck = await isMod(client, message, "KICK_MEMBERS");
    if (permCheck === false) return embeds.permErr(message, "kick_members");

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

    const memberToKick =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!memberToKick)
      return embeds.errEmbed(message, "Specified user not found in the guild");
    if (memberToKick.id == message.author.id)
      return embeds.errEmbed(message, "You cannot kick yourself");
    if (
      memberToKick.roles.highest.position >=
      message.member.roles.highest.position &&
      message.guild.ownerID !== message.author.id
    )
      return embeds.errEmbed(
        message,
        "You cannot kick someone with their highest role placed greater than or equal to yours"
      );

    if (!memberToKick.kickable)
      return embeds.errEmbed(message, "That user is not kickable by you");
    if (
      !message.guild.me.hasPermission("KICK_MEMBERS") &&
      !message.guild.me.hasPermission("ADMINISTRATOR")
    )
      return embeds.errEmbed(
        "I do not have the required permission(s) to perform that action"
      );

    let reason;

    await guild.findOne({
      GuildID: message.guild.id
    }, async (err, data) => {
      if (err) {
        throw err;
      }
      if (data) {
        if (!args[1]) {
          if (data.RequireReason == true) {
            return embeds.errEmbed(
              message,
              "A reason is required for moderation actions on this guild"
            );
          } else {
            reason = "No reason stated";
          }
        } else {
          reason = args.slice(1).join(" ");
        }
        if (data.DmOnMod == true) {
          await memberToKick
            .send(
              new Discord.MessageEmbed()
              .addField(
                `${emojis.mod} You have been kicked`,
                `from **${message.guild.name}** for **${reason}**`
              )
              .setTimestamp()
              .setColor(colors.darkPink)
            )
            .catch((err) => {
              console.log(
                `[${message.guild.id}] - ${message.author.tag} - ${err.message}`
              );
            });
        }
        try {
          await memberToKick
            .kick(`${reason} - ${message.author.tag}`)
            .catch(memberToKick.kick(`${reason} - ${message.author.tag}`));
        } catch (err) {
          console.log(err);
        }
        if (data.DeleteOnExec == true) {
          message.delete().catch(() => null);
        }
        const sucMes = await embeds.sucEmbedNoLine(
          message,
          `Kicked **${memberToKick.user.tag}** | **${reason}**`
        );
        if (data.DeleteModResponse === true) {
          setTimeout(() => {
            sucMes.delete().catch(() => null);
          }, 7000)
        }
      }
    });

    let modCaseNumber;

    // saving mod-log case
    await guild.findOne({
        GuildID: message.guild.id,
      },
      async (err, data) => {
        if (err) throw err;

        if (data) {
          if (!data.ModCases.length) {
            modCaseNumber = 1;
            data.ModCases.push({
              action: "Kick",
              modTag: message.author.tag,
              modID: message.author.id,
              reason: reason,
              time: `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`,
              userTag: memberToKick.user.tag,
              userID: memberToKick.user.id,
            });
          } else {
            modCaseNumber = data.ModCases.length + 1;
            data.ModCases.push({
              action: "Kick",
              modTag: message.author.tag,
              modID: message.author.id,
              reason: reason,
              time: `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`,
              userTag: memberToKick.user.tag,
              userID: memberToKick.user.id,
            });
          }

          await data.save();
        } else {
          modCaseNumber = 1;
          const newSc = new guild({
            GuildID: message.guild.id,
            ModCases: [{
              action: "Kick",
              modTag: message.author.tag,
              modID: message.author.id,
              reason: reason,
              time: `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`,
              userTag: memberToKick.user.tag,
              userID: memberToKick.user.id,
            }, ],
          });

          await newSc.save();
        }
      }
    );

    // logging
    await logs.findOne({
        GuildID: message.guild.id,
      },
      async (err, data) => {
        if (err) throw err;

        if (data) {
          if (data.ModLogs !== null) {
            const logChannel = await message.guild.channels.cache.get(
              data.ModLogs
            );

            if (logChannel) {
              const logEmbed = new Discord.MessageEmbed()
                .setTitle(`Case ${modCaseNumber} | Kick`)
                .addField("User", `**${memberToKick.user.tag}**`, true)
                .addField("Moderator", `**${message.author}**`, true)
                .addField("Reason", reason)
                .setTimestamp()
                .setFooter(`User ID : ${memberToKick.user.id}`)
                .setColor(colors.modLog);

              webhookLog(client, logChannel, logEmbed);
            }
          }
        }
      }
    );
    message.channel.stopTyping();
  },
};