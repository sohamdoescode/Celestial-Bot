const moment = require("moment");
const user = require("../../models/user");

module.exports = {
  name: "whois",
  description: "Find out information about a user",
  usage: "whois <@user/user ID/user tag>",
  example: "whois @zhue",
  category: "Moderation",
  timeout: 5000,
  aliases: ["userinfo"],

  async execute(_client, message, args, Discord, emojis, colors, embeds) {
    let memberToFind;

    if (!args[0]) {
      memberToFind = message.member;
    } else {
      memberToFind =
        message.guild.members.cache.get(args[0].trim()) ||
        message.mentions.members.first() ||
        message.guild.members.cache.find(
          (m) => m.user.tag === args.slice(0).join(" ")
        );
    }
    if (!memberToFind)
      return embeds.errEmbed(message, "Specified user not found in the guild");

    const flags = await memberToFind.user.fetchFlags();
    const finalFlagArr = [];

    // check for status
    if (memberToFind.user.presence.status === "online") {
      finalFlagArr.push(emojis.online);
    }
    if (memberToFind.user.presence.status === "idle") {
      finalFlagArr.push(emojis.idle);
    }
    if (memberToFind.user.presence.status === "dnd") {
      finalFlagArr.push(emojis.dnd);
    }
    if (memberToFind.user.presence.status === "offline") {
      finalFlagArr.push(emojis.offline);
    }

    // check for flags and push if any
    if (flags) {
      if (flags.toArray().includes("HOUSE_BALANCE")) {
        finalFlagArr.push(emojis.hypeBalance);
      }
      if (flags.toArray().includes("HOUSE_BRILLIANCE")) {
        finalFlagArr.push(emojis.hypeBrilliance);
      }
      if (flags.toArray().includes("HOUSE_BRAVERY")) {
        finalFlagArr.push(emojis.hypeBrave);
      }
    }

    await user.findOne(
      {
        UserID: memberToFind.user.id,
      },
      async (err, data) => {
        if (err) return embeds.errEmbed(message, err.message);

        if (data) {
          await data.Badges.forEach(async (badge) => {
            finalFlagArr.push(badge);
          });
        }
      }
    );

    const keyPerms = [];
    const allPerms = [
      "KICK_MEMBERS",
      "BAN_MEMBERS",
      "ADMINISTRATOR",
      "MANAGE_MESSAGES",
      "MENTION_EVERYONE",
      "MANAGE_CHANNELS",
      "MANAGE_WEBHOOKS",
      "MANAGE_EMOJIS",
      "MANAGE_NICKNAMES",
      "MANAGE_ROLES",
    ];

    // push key permissions
    allPerms.forEach((perm) => {
      if (memberToFind.hasPermission(perm)) keyPerms.push(perm);
    });

    if (keyPerms.length === 0) keyPerms.push("No key permissions found");

    const finalRoles = [];
    memberToFind.roles.cache.forEach((role) => {
      if (role.id !== message.guild.roles.everyone.id) {
        finalRoles.push(`<@&${role.id}>`);
      }
    });

    const allRoles = finalRoles.slice(0, 20); // showing only first 20 to not exceed embed limit

    // highest color of member. If none use deafault darkPink
    let color = memberToFind.displayHexColor;
    if (!color || color === null || color === "#000000")
      color = colors.darkPink;

    const finalEmbed = new Discord.MessageEmbed()
      .addField(
        `${memberToFind.user.tag} ${finalFlagArr[0]}`,
        finalFlagArr.slice(1).join(" ")+"⠀⠀⠀⠀⠀" || "⠀⠀"+"⠀⠀⠀⠀⠀"
      )
      .setThumbnail(
        memberToFind.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .addField(
        "Created At",
        moment(memberToFind.user.createdAt).format(
          "dddd, MMMM Do YYYY, HH:mm:ss"
        ),
        true
      )
      .addField(
        "Joined At",
        moment(memberToFind.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss"),
        true
      )
      .addField(
        `${emojis.rr} Roles [${finalRoles.length}]`,
        allRoles.join("") || "No roles"
      )
      .addField(
        `${emojis.folder_icon} Key Permissions`,
        `\`\`\`\n${keyPerms.join(", ")}\`\`\``
      )
      .setFooter(`ID : ${memberToFind.user.id}`)
      .setColor(color);

    await message.channel.send(finalEmbed).catch((err) => {
      console.log(err.message);
    });
  },
};
