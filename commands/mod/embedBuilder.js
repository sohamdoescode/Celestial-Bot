// global vars
let channel;
let title;
let desc;
let author;
let image;
let thumb;
let footer;

module.exports = {
  name: "embedbuilder",
  description: "Make an outstanding embed with the interactive embed builder",
  usage: "embedbuilder",
  example: "embedbuilder",
  category: "Moderation",
  timeout: 10000,
  aliases: ["buildembed"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    return message.lineReply("This feature is under maintenance! Please check back soon!");
    const col1 = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id, {
        time: 120000,
        max: 1
      }
    );
    const col2 = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id, {
        time: 300000,
        max: 2
      }
    );
    const col3 = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id, {
        time: 900000,
        max: 3
      }
    );
    const col4 = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id, {
        time: 300000,
        max: 4
      }
    );
    const col5 = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id, {
        time: 300000,
        max: 5
      }
    );
    const col6 = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id, {
        time: 300000,
        max: 6
      }
    );
    const col7 = new Discord.MessageCollector(
      message.channel,
      (m) => m.author.id === message.author.id, {
        time: 300000,
        max: 7
      }
    );

    await message.channel
      .send(new Discord.MessageEmbed().setFooter("Your embed is empty :("))
      .then(async (msg) => {
        await message.channel
          .send(`${emojis.load} Enter channel to send embed to :`)
          .then(async (m) => {
            // collecting channel
            await col1.on("collect", async (collected) => {
              if (collected.mentions.channels) {
                channel =
                  collected.mentions.channels.first() ||
                  message.guild.channels.cache.get(collected.content);
                if (!channel)
                  return embeds.errEmbed(
                    message,
                    "Specified channel not found in the guild"
                  );
                await collected.delete();
                await m.delete();
                await col1.stop(true);

                // collecting title
                await message.channel
                  .send(
                    `${emojis.load} Enter a title for your embed : [max 250 chars]`
                  )
                  .then(async (m) => {
                    await col2.on("collect", async (collected) => {
                      if (collected.content.length > 256)
                        return embeds.errEmbed(
                          message,
                          "Embed titles can only be 256 characters long"
                        );
                      title = collected.content;
                      await msg.edit(
                        new Discord.MessageEmbed().setTitle(title)
                      );
                      await collected.delete();
                      await m.delete();
                      await col2.stop(true);

                      // collection description
                      await message.channel
                        .send(
                          `${emojis.load} Enter a description for your embed : [max 2048 chars]`
                        )
                        .then(async (m) => {
                          await col3.on("collect", async (collected) => {
                            if (collected.content.length > 2048)
                              return embeds.errEmbed(
                                message,
                                "Embed descriptions can only be 2048 characters long"
                              );
                            desc = collected.content;
                            await msg.edit(
                              new Discord.MessageEmbed()
                              .setTitle(title)
                              .setDescription(desc)
                            );
                            await collected.delete();
                            await m.delete();

                            // -------------------------- SENDING FINAL EMBED ---------------------------------
                            const finalEmbed = new Discord.MessageEmbed()
                              .setTitle(title)
                              .setDescription(desc);

                            await channel.send(finalEmbed).catch((err) => {
                              console.log(err.message);
                              return embeds.errEmbed(
                                message,
                                "The embed-builder has timed out"
                              );
                            });
                            await embeds.sucEmbed(
                              message,
                              `Your embed was posted [${channel}]`
                            );
                            await col3.stop(true);
                            // --------------------------------------------------------------------------------
                          }); // end of col3 callback

                          await col3.on("end", (collected, reason) => {
                            if (reason === "time") {
                              return embeds.errEmbed(
                                message,
                                "The embed-builder has timed out"
                              );
                            }
                          });
                        });
                    }); // end of collector
                    await col2.on("end", (collected, reason) => {
                      if (reason === "time") {
                        return embeds.errEmbed(
                          message,
                          "The embed-builder has timed out"
                        );
                      }
                    });
                  });
              }
            }); // end of collector
            await col1.on("end", (collected, reason) => {
              if (reason === "time") {
                return embeds.errEmbed(
                  message,
                  "The embed-builder has timed out"
                );
              }
            });
          });
      }); // end of main(preview embed) message
  },
};