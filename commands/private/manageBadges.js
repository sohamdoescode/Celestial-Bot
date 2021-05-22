const user = require("../../models/user");
const { ownerID } = require("../../config/bot-settings.json");

module.exports = {
  name: "badge",
  description: "Add/remove a badge from a user",
  usage: "badge <add/del> @user/userID <badge name>",
  example: "badge add @zhue developer",
  category: "private",
  timeout: 1000,
  aliases: [],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (message.author.id !== ownerID) return;

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

    if (args[0].toLowerCase() === "add") {
      if (!args[1])
        return embeds.errEmbed(message, "Mention user to add a badge to!");
      const memberAdd =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]);
      if (!memberAdd)
        return embeds.errEmbed(
          message,
          "Specified user not found in this guild"
        );
      if (!args[2]) return embeds.errEmbed(message, "Enter badge to add");
      const badgeAdd = args[2].toLowerCase();

      await user.findOne(
        {
          UserID: memberAdd.user.id,
        },
        async (err, data) => {
          if (err) throw err;

          if (data) {
            if (badgeAdd === "developer") {
              await data.Badges.push(emojis.dev);
              await data.save();
            } else if (badgeAdd === "earlysupporter") {
              await data.Badges.push(emojis.early);
              await data.save();
            } else if (badgeAdd === "contributor") {
              await data.Badges.push(emojis.contributor);
              await data.save();
            } else if (badgeAdd === "staff") {
              await data.Badges.push(emojis.botStaff);
              await data.save();
            } else {
              return embeds.errEmbed(message, "Not a valid option!");
            }
          } else if (badgeAdd === "developer") {
            const newBadge = new user({
              UserID: memberAdd.user.id,
              Badges: [emojis.dev],
            });
            await newBadge.save();
          } else if (badgeAdd === "earlysupporter") {
            const newBadge = new user({
              UserID: memberAdd.user.id,
              Badges: [emojis.early],
            });
            await newBadge.save();
          } else if (badgeAdd === "contributor") {
            const newBadge = new user({
              UserID: memberAdd.user.id,
              Badges: [emojis.contributor],
            });
            await newBadge.save();
          } else if (badgeAdd === "staff") {
            const newBadge = new user({
              UserID: memberAdd.user.id,
              Badges: [emojis.botStaff],
            });
            await newBadge.save();
          } else {
            return embeds.errEmbed(message, "Not a valid option!");
          }
        }
      );

      //await embeds.sucEmbed(message, "Done!");
    }
  },
};
