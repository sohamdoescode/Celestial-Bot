module.exports = {
  name: "avatar",
  description: "Display your user avatar",
  usage: "avatar [@user/user ID/user tag]",
  example: "avatar @zhue",
  category: "Utility",
  timeout: 500,
  aliases: ["av", "profilepic", "pfp"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let memberUser;

    if (!args[0]) memberUser = message.member;
    else
      memberUser =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find((m) => m.user.tag == args[0]);

    if (!memberUser)
      return embeds.errEmbed(message, "Specified user not found in the guild");

    let color;
    if (
      memberUser.user.displayHexColor !== null &&
      memberUser.user.displayHexColor !== "#000000" &&
      color
    )
      color = memberUser.user.displayHexColor;
    else color = colors.darkPink;

    const avEmbed = new Discord.MessageEmbed()
      .setTitle(`${memberUser.user.username}'s Avatar`)
      .setDescription(
        `Direct links : [PNG](${memberUser.user.displayAvatarURL({
          format: "png",
        })}) | [JPG](${memberUser.user.displayAvatarURL({
          format: "jpg",
        })}) | [GIF](${memberUser.user.displayAvatarURL({
          dynamic: true,
          format: "gif",
        })})`
      )
      .setColor(color)
      .setImage(memberUser.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setTimestamp();

    message.lineReplyNoMention(avEmbed).catch((err) => {
      console.log(err.message);
    });
  },
};
