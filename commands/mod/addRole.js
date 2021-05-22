const {
  isMod
} = require("../../utils/functions/permissionCheck");
const Discord = require("discord.js")

module.exports = {
  name: "addrole",
  description: "Give a role to a user",
  usage: "addrole <@user/user ID> <@role/role name/role ID>",
  example: "addrole @zhue @Cool Person",
  category: "Moderation",
  timeout: 2000,
  aliases: ["giverole", "roleadd"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const permCheck = await isMod(client, message, "MANAGE_ROLES");

    if (permCheck === false) return embeds.permErr(message, "manage_roles");

    // eslint-disable-next-line max-len
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
    if (!member || !message.guild.members.cache.has(member.id))
      return embeds.errEmbed(
        message,
        "Specified user could not be found in the guild"
      );

    if (!args[1])
      return embeds.errEmbed(message, "You need to specify a role to add");
    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find((r) => r.name == args.slice(1).join(" "));
    if (!role || !message.guild.roles.cache.has(role.id))
      return embeds.errEmbed(
        message,
        "Specified role could not be found in the guild"
      );

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

    if (member.roles.cache.has(role.id))
      return embeds.errEmbed(
        message,
        `Specified user already has the role **${role.name}**`
      );
    await member.roles
      .add(role.id, `Addrole command - ${message.author.tag}`)
      .catch(() => null);
    await embeds.sucEmbed(
      message,
      `**${role.name}** has been given to **${member.user.tag}**`
    );
  },
};