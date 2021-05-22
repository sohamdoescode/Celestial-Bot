const { isAdmin } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "steal",
  description:
    "Sneakily steal an emoji. No one has to know. (Non-default emojis only)",
  usage: "steal <emoji> [name]",
  example: "steal :kek: optional_name_kek",
  category: "Utility",
  timeout: 3000,
  aliases: ["stealemoji"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (
      !message.member.hasPermission("ADMINISTRATOR") &&
      !message.member.hasPermission("MANAGE_EMOJIS") &&
      message.guild.ownerID !== message.author.id
    ) {
      let permCheck = await isAdmin(client, message);
      if (permCheck == false) {
        return embeds.permErr(message, "manage_emojis");
      }
    }
    if (!args[0]) {
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
    }

    const parsedEmoji = Discord.Util.parseEmoji(args[0]);
    if (parsedEmoji.id == null) {
      return embeds.errEmbed(
        message,
        "Specified emoji is not a valid custom emoji"
      );
    }

    const attachment = `https://cdn.discordapp.com/emojis/${parsedEmoji.id}.${
      parsedEmoji.animated ? "gif" : "png"
    }`;

    let emojiName;
    if (!args[1]) {
      emojiName = parsedEmoji.name.toString();
    } else {
      if (
        args.slice(1).join("_").length < 2 ||
        args.slice(1).join("_").length > 32
      ) {
        return embeds.errEmbed(
          message,
          "Emoji names must be between 2 and 32 characters in length"
        );
      }
      emojiName = args.slice(1).join("_");
    }

    message.channel.startTyping();
    const emoji = await message.guild.emojis
      .create(attachment, emojiName.split(":")[0])
      .catch((err) => {
        throw err;
      });

    await message
      .lineReplyNoMention(
        new Discord.MessageEmbed()
          .setColor(colors.green)
          .setDescription(
            `${emoji.toString()} added with the name **${emoji.name}**`
          )
      )
      .catch(() => null);

    message.channel.stopTyping();
  },
};
