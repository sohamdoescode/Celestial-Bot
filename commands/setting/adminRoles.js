const guild = require("../../models/guild");
const { isBotManager } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "adminrole",
  description: "Add/remove roles to restrict admin commands to (max. 3)",
  usage:
    "adminrole add <@role/role ID/role name>\nadminrole delete <role ID>\nadminrole list",
  example: "adminrole add @Admin",
  category: "Settings",
  timeout: 5000,
  aliases: ["adminroles", "ar"],

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

    if (args[0].toLocaleLowerCase() === "add") {
      if (!args[1])
        return embeds.errEmbed(
          message,
          "You need to specify a role to add to the admin-roles list"
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
          "The `@everyone` role cannot be added as an admin-role"
        );
      if (
        roleAdd.position >= message.member.roles.highest.position &&
        message.author.id !== message.guild.ownerID
      )
        return embeds.errEmbed(
          message,
          "You can only manage admin-roles for roles placed below your highest role"
        );

      // find from schema
      await guild.findOne(
        {
          GuildID: message.guild.id,
        },
        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          if (data) {
            if (data.AdminRoles.length >= 3)
              return embeds.errEmbed(
                message,
                "You can only have up to 3 admin roles per guild"
              );

            if (data.AdminRoles.includes(roleAdd.id))
              return embeds.errEmbed(
                message,
                "That role is already set as a admin-role"
              );

            await data.AdminRoles.push(roleAdd.id);
            await data.save();

            await embeds.sucEmbed(
              message,
              `**${roleAdd.name}** has been added to the list of administrator roles`
            );
          }

          // create new guild schema (default options already set)
          else {
            const newMr = new guild({
              GuildID: message.guild.id,
              AdminRoles: [roleAdd.id],
            });
            await newMr.save();

            await embeds.sucEmbed(
              message,
              `**${roleAdd.name}** has been added to the list of administrator roles`
            );
          }
        }
      );
    } // end of add
    else if (args[0].toLocaleLowerCase() === "delete") {
      if (!args[1])
        return embeds.errEmbed(
          message,
          "You need to specify a role ID to delete from the list of admin roles"
        );

      await guild.findOne(
        {
          GuildID: message.guild.id,
        },
        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          // document exists
          if (data) {
            // array includes specified ID
            if (data.AdminRoles.includes(args[1])) {
              const index = data.AdminRoles.indexOf(args[1]);

              if (index > -1) {
                data.AdminRoles.splice(index, 1);
                await data.save();
              }

              return embeds.sucEmbed(
                message,
                `<@&${args[1]}> was successfully removed from the list of admin roles`
              );
            }

            // array does not include specified role

            return embeds.errEmbed(
              message,
              "Specified role could not be found in the admin roles list"
            );
          }
          // guild does not exist in database
          else {
            return embeds.errEmbed(
              message,
              "This guild does not exist in the database. Try setting up one or more custom settings to add it to the database"
            );
          }
        }
      );
    } // end of delete
    else if (args[0].toLocaleLowerCase() === "list") {
      await guild.findOne(
        {
          GuildID: message.guild.id,
        },
        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          if (data) {
            const tempArr = [];

            data.AdminRoles.forEach((role) => {
              tempArr.push(`${emojis.pinkDot} <@&${role}> - \`${role}\``);
            });

            let finalRoles;
            if (data.AdminRoles.length == 0) finalRoles = "No admin-roles set";
            else finalRoles = tempArr.join("\n");

            const mREmbed = new Discord.MessageEmbed()
              .setTitle("Admin-roles List")
              .setDescription(finalRoles)
              .setTimestamp()
              .setFooter(`Requested by ${message.author.tag}`)
              .setColor(colors.darkPink);

            message.channel.send(mREmbed).catch((err) => {
              embeds.errEmbed(message, err.message);
            });
          } else {
            return embeds.errEmbed(
              message,
              "This guild does not exist in the database. Try setting up one or more custom settings to add it to the database"
            );
          }
        }
      );
    }
  },
};
