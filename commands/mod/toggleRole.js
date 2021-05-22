const { isMod } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "togglerole",
  description:
    "Add a role to a user if they don't have it and remove it from them if they do",
  usage: "togglerole <@user/user ID> <@role/role name/role ID>",
  example: "togglerole @zhue @Cool Person",
  category: "Moderation",
  timeout: 2000,
  aliases: ["role"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const permCheck = await isMod(client, message, "MANAGE_ROLES");
    if (permCheck == false) return embeds.permErr(message, "manage_roles");

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
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      return embeds.errEmbed(message, "Specified user not found in the guild");

    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find((r) => (r.name = args.slice(1).join(" ")));
    if (!role || !message.guild.roles.cache.has(role.id))
      return embeds.errEmbed(message, "Specified role not found in the guild");

    if (
      message.guild.me.roles.highest.postion <= role.postion &&
      message.author.id !== message.guild.ownerID
    )
      return embeds.errEmbed(
        message,
        "My highest role needs to be placed higher than the role you want to manage"
      );
    if (
      message.member.roles.highest.postion <= role.postion &&
      message.author.id !== message.guild.ownerID
    )
      return embeds.errEmbed(
        message,
        "Your highest role needs to be placed higher than the role you want to manage"
      );

    if (member.roles.cache.has(role.id)) {
      member.roles
        .remove(role.id, {
          reason: `ToggleRole command - ${message.author.tag}`,
        })
        .catch(() => null);
      return embeds.sucEmbed(
        message,
        `**${role.name}** has been removed from **${member.user.tag}**`
      );
    }

    member.roles
      .add(role.id, { reason: `ToogleRole command - ${message.author.tag}` })
      .catch(() => null);
    return embeds.sucEmbed(
      message,
      `**${role.name}** has been added to **${member.user.tag}**`
    );
  },
};
