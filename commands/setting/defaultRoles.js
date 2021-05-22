const guild = require("../../models/guild");
const { isBotManager } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "defaultrole",
  description: "Add/remove roles to use for general commands and such",
  usage:
    "defaultrole add <@role/role ID/role name>\ndefaultrole delete <role ID>\nmodrole list",
  example: "defaultrole add @Member",
  category: "Settings",
  timeout: 5000,
  aliases: ["defaultroles", "dfr"],

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
          "You need to specify a role to add to the default-roles list"
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
          "The `@everyone` role cannot be added as an defaultrole"
        );
      if (
        roleAdd.position >= message.member.roles.highest.position &&
        message.author.id !== message.guild.ownerID
      )
        return embeds.errEmbed(
          message,
          "You can only manage default-roles for roles placed below your highest role"
        );

      // find from schema
      await guild.findOne(
        {
          GuildID: message.guild.id,
        },
        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          if (data) {
            if (data.DefaultRoles.length >= 50)
              return embeds.errEmbed(
                message,
                "You can only have up to 50 default roles per guild"
              );

            if (data.DefaultRoles.includes(roleAdd.id))
              return embeds.errEmbed(
                message,
                "That role is already set as a default-role"
              );

            await data.DefaultRoles.push(roleAdd.id);
            await data.save();

            await embeds.sucEmbed(
              message,
              `**${roleAdd.name}** has been added to the list of default roles`
            );
          }

          // create new guild schema (default options already set)
          else {
            const newMr = new guild({
              GuildID: message.guild.id,
              DefaultRoles: [roleAdd.id],
            });
            await newMr.save();

            await embeds.sucEmbed(
              message,
              `**${roleAdd.name}** has been added to the list of default roles`
            );
          }
        }
      );
    } // end of add
    else if (args[0].toLocaleLowerCase() === "delete") {
      if (!args[1])
        return embeds.errEmbed(
          message,
          "You need to specify a role ID to delete from the list of default roles"
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
            if (data.DefaultRoles.includes(args[1])) {
              const index = data.DefaultRoles.indexOf(args[1]);

              if (index > -1) {
                data.DefaultRoles.splice(index, 1);
                await data.save();
              }

              return embeds.sucEmbed(
                message,
                `<@&${args[1]}> was successfully removed from the list of default roles`
              );
            }

            // array does not include specified role

            return embeds.errEmbed(
              message,
              "Specified role could not be found in the mod roles list"
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

            data.DefaultRoles.forEach((role) => {
              tempArr.push(`${emojis.pinkDot} <@&${role}> - \`${role}\``);
            });

            let finalRoles;
            if (data.DefaultRoles.length == 0) finalRoles = "No mod-roles set";
            else finalRoles = tempArr.join("\n");

            const mREmbed = new Discord.MessageEmbed()
              .setTitle("Default-Roles List")
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
