const autoRoles = require("../../models/autoRoles");
const {
  ownerID
} = require("../../config/bot-settings.json");
const {
  isBotManager,
  isAdmin,
} = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "autorole",
  description: "Add/remove roles to add automatically when users join (max. 10)",
  usage: "autorole add <@role/role ID/role name>\nautorole delete <role ID>\nautorole <enable/disable>\nautorole list",
  example: "autorole add @Members",
  category: "Moderation",
  timeout: 5000,
  aliases: ["autoroles", "ar"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const permCheck1 = await isBotManager(client, message);
    const permCheck2 = await isAdmin(client, message);

    if (permCheck1 == false && permCheck2 == false)
      return embeds.permErr(message, "ADMINISTRATOR");

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

    if (args[0].toLocaleLowerCase() === "add") {
      if (!args[1])
        return embeds.errEmbed(
          message,
          "You need to specify a role to add to auto-role list"
        );

      // trimming to ignore extra spaces
      const roleAdd =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1].trim()) ||
        message.guild.roles.cache.find(
          (r) => r.name === args.slice(1).join(" ").trim()
        );

      // role not found
      if (!roleAdd || !message.guild.roles.cache.has(roleAdd.id))
        return embeds.errEmbed(
          message,
          "Specified role could not be found in the guild"
        );
      if (roleAdd.id == message.guild.roles.everyone.id)
        return embeds.errEmbed(
          message,
          "The `@everyone` role cannot be added as an autorole"
        );
      if (
        roleAdd.position >= message.member.roles.highest.position &&
        message.author.id !== message.guild.ownerID
      )
        return embeds.errEmbed(
          message,
          "You can only manage auto-roles for roles placed below your highest role"
        );

      // find from schema
      await autoRoles.findOne({
          Guild: message.guild.id,
        },
        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          // document already exists
          if (data) {
            // maximum limit reached (10)
            if (data.Roles.length >= 20) {
              return embeds.errEmbed(
                message,
                "You can only have up to 20 autoroles per guild"
              );
            }

            // not reached

            if (data.Roles.includes(roleAdd.id))
              return embeds.errEmbed(
                message,
                "That role is already set as an auto-role"
              );

            await data.Roles.push(roleAdd.id);

            await data.save();
            return embeds.sucEmbed(
              message,
              `**${roleAdd.name}** has been added to the list of auto-roles`
            );
          }

          // document doesn't exist

          const newAr = new autoRoles({
            Guild: message.guild.id,
            Roles: [roleAdd.id],
          });

          await newAr.save();

          return embeds.sucEmbed(
            message,
            `**${roleAdd.name}** has been added to the list of auto-roles`
          );
        }
      );
    }

    // remove from list
    else if (args[0].toLocaleLowerCase() === "delete") {
      if (!args[1])
        return embeds.errEmbed(
          message,
          "You need to specify a role ID to delete from the auto-role list!"
        );

      await autoRoles.findOne({
          Guild: message.guild.id,
        },
        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          // guild exists in document
          if (data) {
            // array has specified ID
            if (data.Roles.includes(args[1])) {
              const index = data.Roles.indexOf(args[1]);

              if (index > -1) {
                await data.Roles.splice(index, 1);
                await data.save();
              }

              return embeds.sucEmbed(
                message,
                `<@&${args[1]}> was successfully removed from auto-roles list`
              );
            }

            // role ID is not included in the array

            return embeds.errEmbed(
              message,
              "Specified role could not be found in the auto-roles list"
            );
          }

          // guild doesn't exist in document

          return embeds.errEmbed(
            message,
            "No auto-roles are set up for this guild"
          );
        }
      );
    }

    // list out all autoRoles
    else if (args[0].toLocaleLowerCase() === "list") {
      await autoRoles.findOne({
          Guild: message.guild.id,
        },
        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          if (data) {
            const initialArr = [];

            data.Roles.forEach((role) => {
              initialArr.push(`${emojis.pinkDot} <@&${role}> - \`${role}\``);
            });

            if (initialArr.length == 0) initialArr.push("No autoroles set");

            const listEmbed = new Discord.MessageEmbed()
              .setTitle("Auto-Roles List")
              .setDescription(initialArr.join("\n"))
              .setColor(colors.darkPink)
              .setTimestamp()
              .setFooter(`Requested by ${message.author.tag}`);

            message.channel.send(listEmbed).catch((err) => {
              embeds.errEmbed(message, err.message);
            });
          } else {
            return embeds.errEmbed(
              message,
              "No auto-roles are set up for this guild"
            );
          }
        }
      );
    }

    // dev only - might remove in future
    else if (args[0].toLocaleLowerCase() === "simulate") {
      if (message.author.id !== ownerID) return; // dev only command

      const memberAdd = message.mentions.members.first();

      if (!memberAdd) return;

      await autoRoles.findOne({
          Guild: message.guild.id
        },
        async (err, data) => {
          if (err) throw err;

          data.Roles.forEach((role) => {
            memberAdd.roles.add(role).catch((er) => console.log(er));
          });
        }
      );

      await message.channel.send("Done");
    }
  },
};