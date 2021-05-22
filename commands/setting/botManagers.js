const guild = require("../../models/guild");

module.exports = {
  name: "botmanager",
  description:
    "Add/remove roles to restrict settings commands to (max. 2). Note : this is a dangerous permission to grant as bot-managers can manage all settings apart from this setting itself (this as well if they have admin)",
  usage:
    "botmanager add <@role/role ID/role name>\nbotmanager delete <role ID>\nbotmanager list",
  example: "botmanager add @Admins",
  category: "Settings",
  timeout: 5000,
  aliases: ["botmanagerroles"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (
      message.member.hasPermission("ADMINISTRATOR") ||
      message.author.id == message.guild.ownerID
    ) {
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
            "You need to specify a role to add to the mod-roles list"
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
            "The `@everyone` role cannot be added as a bot-manager role"
          );
        if (
          roleAdd.position >= message.member.roles.highest.position &&
          message.author.id !== message.guild.ownerID
        )
          return embeds.errEmbed(
            message,
            "You can only manage bot-manager roles for roles placed below your highest role"
          );

        // find from schema
        await guild.findOne(
          {
            GuildID: message.guild.id,
          },
          async (err, data) => {
            if (err) return embeds.errEmbed(message, err.message);

            if (data) {
              if (data.BotManagers.length >= 2)
                return embeds.errEmbed(
                  message,
                  "You can only have up to 2 bot-manager roles per guild"
                );

              if (data.BotManagers.includes(roleAdd.id))
                return embeds.errEmbed(
                  message,
                  "That role is already set as a bot-manager role"
                );

              await data.BotManagers.push(roleAdd.id);
              await data.save();

              await embeds.sucEmbed(
                message,
                `**${roleAdd.name}** has been added to the list of bot-manager roles`
              );
            }

            // create new guild schema (default options already set)
            else {
              const newMr = new guild({
                GuildID: message.guild.id,
                BotManagers: [roleAdd.id],
              });
              await newMr.save();

              await embeds.sucEmbed(
                message,
                `**${roleAdd.name}** has been added to the list of bot-manager roles`
              );
            }
          }
        );
      } // end of add
      else if (args[0].toLocaleLowerCase() === "delete") {
        if (!args[1])
          return embeds.errEmbed(
            message,
            "You need to specify a role ID to delete from the list of bot-manager roles"
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
              if (data.BotManagers.includes(args[1])) {
                const index = data.BotManagers.indexOf(args[1]);

                if (index > -1) {
                  data.BotManagers.splice(index, 1);
                  await data.save();
                }

                return embeds.sucEmbed(
                  message,
                  `<@&${args[1]}> was successfully removed from the list of bot-manager roles`
                );
              }

              // array does not include specified role

              return embeds.errEmbed(
                message,
                "Specified role could not be found in the bot-manager roles list"
              );
            }
            // guild does not exist in database

            {
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

              data.BotManagers.forEach((role) => {
                tempArr.push(`${emojis.pinkDot} <@&${role}> - \`${role}\``);
              });

              let finalRoles;
              if (data.BotManagers.length == 0)
                finalRoles = "No bot-manager roles set";
              else finalRoles = tempArr.join("\n");

              const mREmbed = new Discord.MessageEmbed()
                .setTitle("Bot-Manager Roles List")
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
    } else {
      return embeds.permErr(message, "administrator");
    }
  },
};
