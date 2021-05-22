const tickets = require("../../models/tickets");

let ticketCat;
let ticketChannel;
let ticketMessage;
let ticketLogs;
let supportRole;

module.exports = {
  name: "tsetup",
  description:
    "Let Celestial automatically set-up the ticketing system in the server",
  usage: "tsetup",
  example: "tsetup",
  category: "Tickets",
  timeout: 20000,
  aliases: ["ticketsetup"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    await tickets.findOne({ GuildID: message.guild.id }, async (err, data) => {
      if (err) {
        throw err;
      }
      if (data) {
        return embeds.errEmbed(
          message,
          "The ticketing system for this guild is already set up! Run `treset` to reset ticket settings"
        );
      } else {
        message.channel.startTyping();

        //create "Tickets category"
        ticketCat = await message.guild.channels.create("Tickets", {
          type: "category",
        });

        //create panel channel
        await message.guild.channels
          .create("create-tickets", {
            type: "text",
            parent: ticketCat,
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
                allow: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL"],
              },
            ],
          })
          .then((created) => {
            ticketChannel = created.id;
            created
              .send(
                new Discord.MessageEmbed()
                  .setAuthor(
                    "Tickets",
                    "https://icon-library.com/images/email-icon-png-white/email-icon-png-white-27.jpg"
                  )
                  .addField(
                    "Contact Staff",
                    "To create a ticket, react with 📨"
                  )
                  .setFooter("Powered by Celestial™")
                  .setColor(colors.darkPink)
              )
              .then((sent) => {
                sent.react("📨").catch(() => null);
                ticketMessage = sent.id;
              });
          })
          .catch(() => null);

        //create "Ticket Logs category"
        let logCategory = await message.guild.channels
          .create("Ticket Logs", {
            type: "category",
          })
          .catch(() => null);

        //create log channel
        await message.guild.channels
          .create("ticket-logs", {
            type: "text",
            parent: logCategory.id,
            permissionOverwrites: [
              {
                id: message.guild.id,
                deny: ["VIEW_CHANNEL"],
              },
            ],
          })
          .then((created) => {
            ticketLogs = created.id;
          });

        await message.guild.roles
          .create({
            data: {
              name: "Ticket Support",
              color: colors.darkPink,
              hoist: false,
            },
            reason: "Automatic Ticket Setup",
          })
          .then((created) => {
            supportRole = created.id;
          })
          .catch(() => null);

        await tickets.findOne(
          { GuildID: message.guild.id },
          async (err, data) => {
            if (err) {
              throw err;
            }
            if (data) return;
            else {
              const newSchema = new tickets({
                GuildID: message.guild.id,
                SupportRole: supportRole,
                Category: ticketCat,
                LogChannel: ticketLogs,
                Channel: ticketChannel,
                Message: ticketMessage,
              });
              await newSchema.save();
              await embeds.sucEmbed(message, "Ticket set-up successful");
            }
          }
        );

        message.channel.stopTyping();
      }
    });
  },
};
