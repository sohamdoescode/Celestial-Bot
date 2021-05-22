const tickets = require("../../models/tickets");
const { isBotManager } = require("../../utils/functions/permissionCheck");

module.exports = {
  name: "treset",
  description:
    "Permanently delete ticket configuration for the current guild. This cannot be undone",
  usage: "treset",
  example: "treset",
  category: "Tickets",
  timeout: 10000,
  aliases: ["ticketreset", "resettickets"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let permCheck = await isBotManager(client, message);
    if (permCheck == false) return embeds.permErr(message, "administrator");

    await tickets.findOne({ GuildID: message.guild.id }, async (err, data) => {
      if (err) {
        throw err;
      }
      if (data) {
        const filter = (reaction, user) => {
          return (
            reaction.emoji.id === "775271484163227690" ||
            (reaction.emoji.id === "775271483681144844" &&
              user.id === message.author.id)
          );
        };
        const msg = await message.channel
          .send(
            new Discord.MessageEmbed()
              .setDescription(
                `Are you sure you want to reset ticket configuration?`
              )
              .setColor(colors.darkPink)
          )
          .catch(() => null);
        await msg.react(emojis.tick).catch(() => null);
        await msg.react(emojis.cross).catch(() => null);
        const collector = await msg.createReactionCollector(filter, {
          time: 60000,
          max: 1,
        });
        collector.on("collect", async (reaction, user) => {
          if (reaction.emoji.id === "775271484163227690") {
            await tickets.findOneAndDelete({ GuildID: message.guild.id });
            await embeds.sucEmbed(
              message,
              "Successfully removed ticket configuration"
            );
            await msg.reactions.removeAll().catch(()=> null); 
            collector.stop(true);
          } else if (reaction.emoji.id === "775271483681144844") {
            collector.stop(true);
            await msg.reactions.removeAll().catch(()=> null);
            return embeds.sucEmbed(message, "Reset cancelled");
          }
        });
        collector.on("end", (collected, reason) => {
          if (reason === "time") {
            msg.reactions.removeAll().catch(()=> null); 
            return embeds.errEmbed(message, "You didn't reply on time");
          }
        });
      } else {
        return embeds.errEmbed(
          message,
          "Specified guild does not have any ticket configuration set up"
        );
      }
    });
  },
};
