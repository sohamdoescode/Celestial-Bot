const {
  CollectorUtils
} = require("discord.js-collector-utils")
const ms = require("ms")


module.exports = {
  name: "gcreate",
  description: "Create a giveaway (interactive setup)",
  usage: "gcreate",
  example: "gcreate",
  category: "Giveaways",
  timeout: 5000,
  aliases: ["giveawaycreate"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {

    const initial = await message.channel.send(
      new Discord.MessageEmbed()
      .setAuthor("Giveaway Setup")
      .setDescription("Specify the channel where the giveaway is going to be held `[mention/name/id]`")
      .setColor(colors.darkPink)
      .setFooter(`Type "cancel" to cancel`)
    ).catch(() => null)

    let channel = await CollectorUtils.collectByMessage(
      message.channel,
      (m) => m.author.id === message.author.id,
      (m) => m.author.id === message.author.id && m.content.toLowerCase() === "cancel",
      async (collected) => {
          collected.delete().catch(() => null)
          if (collected.mentions.channels.size > 0) {
            if (!message.guild.channels.cache.has(collected.mentions.channels.first().id)) {
              return embeds.disappearingErrEmbed(message, "Specified channel not found in the guild")
            } else {
              return collected.mentions.channels.first()
            }
          } else {
            const found =
              message.guild.channels.cache.get(collected.content) ||
              message.guild.channels.cache.find((c) => c.name.toLowerCase() === collected.content.toLowerCase())
            if (!found) {
              return embeds.disappearingErrEmbed(message, "Specified channel not found in the guild")
            }
            return found
          }
        },
        async () => {
          await embeds.editEmbed(initial, "Timed out")
        }, {
          time: 1000 * 60 * 2, //2 mins
          reset: true
        }
    )
    await embeds.editEmbed(initial, "Specify the duration for which the giveaway will be held. `[m/d/h]`\nExample : 1m -> 1 minute ; 1month -> 1 month")

    let time = await CollectorUtils.collectByMessage(
      message.channel,
      (m) => m.author.id === message.author.id,
      (m) => m.author.id === message.author.id && m.content.toLowerCase() === "cancel",
      async (collected) => {
          collected.delete().catch(() => null)
          if (typeof ms(collected.content) === "undefined") {
            return embeds.disappearingErrEmbed(message, "Invalid format for embed duration. Refer to the example above")
          } else {
            return ms(collected.content)
          }
        },
        async () => {
          await embeds.editEmbed(initial, "Timeout")
        }, {
          time: 1000 * 60 * 2,
          reset: true
        }
    )

    await embeds.editEmbed(initial, "Specify how many winners the giveaway will have")

    let winners = await CollectorUtils.collectByMessage(
      message.channel,
      (m) => m.author.id === message.author.id,
      (m) => m.author.id === message.author.id && message.content.toLowerCase() === "cancel",
      async (collected) => {
          collected.delete().catch(() => null)
          if (isNaN(collected.content)) {
            return embeds.disappearingErrEmbed(message, "Winner count must be a number")
          } else {
            return parseInt(collected.content)
          }
        },
        async () => {
          embeds.editEmbed(initial, "Timeout")
        }, 
        {
          time : 1000 * 60 * 2, 
          reset : true
        }
    )

    await embeds.editEmbed(initial, "Specify the prize for the giveaway")
    let prize = await CollectorUtils.collectByMessage(
      message.channel, 
      (m) => m.author.id === message.author.id, 
      (m) => m.author.id === message.author.id && m.content.toLowerCase() === "cancel", 
      async (collected) => {
        collected.delete().catch(()=> null)
        if(collected.content.length > 256) {
          return embeds.disappearingErrEmbed(message, "Giveaway prize cannot be more than 250 characters in length")
        }
        return collected.content
      }, 
      async () => {
        await embeds.editEmbed(initial, "Timeout")
      }, 
      {
        time : 3 * 1000 * 60, 
        reset : true
      }
    )

    client.giveawaysManager
    .start(channel, {
      time: time,
      prize,
      embedColor: message.guild.me.displayHexColor,
      winnerCount: winners,
      hostedBy: message.author,
    })
    .catch((err) => {
      console.log(err)
      return embeds.errEmbed(
        message,
        "Could not start the giveaway. Please try again"
      );
    });

    return embeds.sucEmbed(message, `Started the giveaway in ${channel}`);
  },
};