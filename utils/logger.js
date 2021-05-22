const { errEmbed } = require("./functions/embeds");

async function webhookLog(client, channel, embed) {
  const webHooks = await channel
    .fetchWebhooks()
    .catch((err) => errEmbed(message, "Failed to fetch webhooks"));

  let hook = webHooks.find((w) => w.name == "Celestial Logging");

  //webhook doesn't exist
  if (!hook) {
    hook = await channel
      .createWebhook("Celestial Logging", {
        avatar: "https://i.postimg.cc/DZC0T38g/logo-pink.png",
      })
      .catch(async (err) => {
        console.log(`[WEBHOOK LOGGER] ${err.message}`);
        await channel
          .createWebhook("Celestial Logging", {
            avatar: "https://i.postimg.cc/DZC0T38g/logo-pink.png",
          })
          .catch((err) => {
            console.log(err);
          });
      });

    //send through webhook
    return await hook.send(embed).catch(async () => {
      return await hook.send(embed).catch(() => null);
    });
  }

  return await hook.send(embed);
}

module.exports = {
  webhookLog,
};
