module.exports = {
  name: "purge",
  description: "Delete messages in bulk (max. 100)",
  usage: "purge [@user] <messages>",
  example: "purge @zhue 69\npurge 42",
  category: "Moderation",
  timeout: 5000,
  aliases: ["prune", "bulkdelete", "bd"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
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
    if (
      !message.guild.me.hasPermission("MANAGE_MESSAGES") ||
      !message.guild.me.hasPermission("ADMINISTRATOR")
    )
      return;

    const user = message.mentions.users.first();

    /**
     * No user mentioned
     */
    if (typeof user == "undefined") {
      const numberToClear = parseInt(args[0]) + 1;
      if (isNaN(numberToClear)) {
        return embeds.errEmbed(message, "Messages to clear must be a number");
      }
      if (numberToClear > 100) {
        return embeds.errEmbed(
          message,
          "Cannot clear more than 100 messages at once, due to Discord's limit"
        );
      }
      if (numberToClear <= 1) {
        return embeds.errEmbed(
          message,
          "Messages to clear must be more than 1"
        );
      }

      await message.channel
        .bulkDelete(numberToClear, true)
        .then((msgs) => {
          //if(msgs.size == 1|| msgs.size == 0) return embeds.errEmbed(message, "Messages older than 14 days (2 weeks) cannot be cleared");
          message.channel
            .send(
              new Discord.MessageEmbed()
              .setDescription(
                `${emojis.tick} Successfully cleared **${
                    msgs.size - 1
                  }** messages`
              )
              .setColor(colors.green)
            )
            .then((confirmation) => {
              setTimeout(() => {
                confirmation.delete().catch(() => null);
              }, 7000);
            })
            .catch(() => null);
        })
        .catch((err) => {
          return embeds.errEmbed(
            message,
            "There was an error in bulk-deleting the messages"
          );
        });
    } else {

      /**
       * User is mentioned
       */
      const numberToClear = parseInt(args[1]);
      if (isNaN(numberToClear)) {
        return embeds.errEmbed(message, "Messages to clear must be a number");
      }
      if (numberToClear > 100) {
        return embeds.errEmbed(
          message,
          "Cannot clear more than 100 messages at once, due to Discord's limit"
        );
      }
      if (numberToClear <= 1) {
        return embeds.errEmbed(
          message,
          "Messages to clear must be more than 1"
        );
      }

      await message.channel.messages
        .fetch({
          limit: 100
        })
        .then(async (fetched) => {
          const toDelete = new Discord.Collection();
          fetched
            .filter((m) => m.author.id === user.id)
            .array()
            .slice(0, numberToClear)
            .map((m) => toDelete.set(m.id, m));
          toDelete.set(message.id, message);

          await message.channel
            .bulkDelete(toDelete)
            .then((deleted) => {
              //if(deleted.size == 0) return embeds.errEmbed(message, "Messages older than 14 days (2 weeks) cannot be cleared");
              message.channel
                .send(
                  new Discord.MessageEmbed()
                  .setDescription(
                    `${emojis.tick} Successfully cleared **${deleted.size}** messages by ${user}`
                  )
                  .setColor(colors.green)
                )
                .then((confirmation) => {
                  setTimeout(() => {
                    confirmation.delete().catch(() => null);
                  }, 7000);
                })
                .catch(() => null);
            })
            .catch((err) => {
              return embeds.errEmbed(
                message,
                "There was an error in bulk-deleting the messages"
              );
            });
        })
        .catch((err) => {
          return embeds.errEmbed(
            message,
            "There was an error in fetching the messages"
          );
        });
    }
  },
};