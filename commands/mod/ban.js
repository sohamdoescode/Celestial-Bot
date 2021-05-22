const guild = require("../../models/guild");
const design = require("../../design/directLinks.json");
const {
  webhookLog
} = require("../../utils/logger");

const now = new Date();
const logs = require("../../models/logs");
const {
  isMod
} = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "ban",
  description: "Banish a user from the guild",
  usage: "ban <@user/user ID> [reason]",
  example: "ban @zhue raiding the server",
  category: "Moderation",
  timeout: 3000,
  aliases: ["banish", "b"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const permCheck = await isMod(client, message, "BAN_MEMBERS");
    if (permCheck == false) return embeds.permErr(message, "ban_members");

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

    const banUser =
      message.mentions.users.first() || (await client.users.fetch(args[0]));
    if (!banUser)
      return embeds.errEmbed(
        message,
        "Specified user is not a valid Discord user"
      );

    if (banUser.id == message.author.id)
      return embeds.errEmbed(message, "You cannot ban yourself");

    // if user is in guild, check for roles
    if (message.guild.members.cache.has(banUser.id)) {
      const inGuild = message.guild.member(banUser);

      // user exists
      if (inGuild) {
        if (!inGuild.bannable)
          return embeds.errEmbed(
            message,
            "Specified user is not bannable by you"
          );
        if (
          inGuild.roles.highest.positon >=
          message.member.roles.highest.position &&
          message.author.id !== message.guild.ownerID
        )
          return embeds.errEmbed(
            message,
            "You cannot ban someone with their highest role placed greater than or equal to yours"
          );
      }
    }

    if (
      !message.guild.me.hasPermission("BAN_MEMBERS") &&
      !message.guild.me.hasPermission("ADMINISTRATOR")
    ) {
      return embeds.errEmbed(
        message,
        "I do not have the required permission(s) to perform that action"
      );
    }

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
        if (
          data.DmOnMod == true &&
          message.guild.members.cache.has(banUser.id)
        ) {
          const memberToKick = message.guild.members.cache.get(banUser.id);
          await memberToKick
            .send(
              new Discord.MessageEmbed()
              .addField(
                `${emojis.mod} You have been banned`,
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
          await message.guild.members
            .ban(banUser.id, {
              reason: `${message.author.tag} - ${reason}`,
              days: 7,
            })
            .catch(
              await message.guild.members.ban(banUser.id, {
                reason: `${message.author.tag} - ${reason}`,
                days: 7,
              })
            );
        } catch (err) {
          console.log(err);
        }
        if (data.DeleteOnExec === true) {
          message.delete().catch(() => null);
        }
        let suc = await embeds.sucEmbedNoLine(
          message,
          `Banned **${banUser.tag}** | **${reason}**`
        );
        if (data.DeleteModResponse === true) {
          setTimeout(() => {
            suc.delete().catch(() => null);
          }, 7000);
        }
      }
    });

    let modCaseNumber;
    await guild.findOne({
        GuildID: message.guild.id
      },

      async (err, data) => {
        if (err)
          return embeds.errEmbed(
            message,
            "Failed to fetch data from database. Please try again"
          );

        if (data) {
          if (!data.ModCases.length) {
            modCaseNumber = 1;
            await data.ModCases.push({
              action: "Ban",
              modTag: message.author.tag,
              modID: message.author.id,
              reason: reason,
              time: `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`,
              userTag: banUser.tag,
              userID: banUser.id,
            });
          } else {
            modCaseNumber = data.ModCases.length + 1;
            await data.ModCases.push({
              action: "Ban",
              modTag: message.author.tag,
              modID: message.author.id,
              reason: reason,
              time: `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`,
              userTag: banUser.tag,
              userID: banUser.id,
            });
          }

          await data.save();
        } else {
          modCaseNumber = 1;

          const newSc = new guild({
            GuildID: message.guild.id,
            ModCases: [{
              action: "Ban",
              modTag: message.author.tag,
              modID: message.author.id,
              reason: reason,
              time: `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`,
              userTag: banUser.tag,
              userID: banUser.id,
            }, ],
          });

          await newSc.save();
        }
      }
    );

    // logging

    await logs.findOne({
      GuildID: message.guild.id
    }, async (err, data) => {
      if (err) throw err;

      if (data) {
        if (data.ModLogs !== null) {
          const logChannel = await message.guild.channels.cache.get(
            data.ModLogs
          );

          if (logChannel) {
            const logEmbed = new Discord.MessageEmbed()
              .setTitle(`Case ${modCaseNumber} | Ban`)
              .addField("User", `**${banUser.tag}**`, true)
              .addField("Moderator", `**${message.author}**`, true)
              .addField("Reason", reason)
              .setTimestamp()
              .setFooter(`User ID : ${banUser.id}`)
              .setColor(colors.modLog);

            webhookLog(client, logChannel, logEmbed);
          }
        }
      }
    });

    message.channel.stopTyping();
  },
};