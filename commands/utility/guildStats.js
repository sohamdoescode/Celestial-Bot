const moment = require("moment");

module.exports = {
  name: "guildstats",
  description: "Find out detailed information about this guild",
  usage: "guildstats",
  example: "guildstats",
  category: "Utility",
  timeout: 5000,
  aliases: ['serverinfo', 'serverstats', 'guildinfo'],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`${message.guild.name}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setDescription(`> ${emojis.id} \`${message.guild.id}\``)
      .addField(
        `General`,
        `${emojis.crown} ${message.guild.owner}
         ${emojis.globe} ${message.guild.region}
         ${emojis.member} ${message.guild.members.cache.size.toLocaleString()}`,
        true
      )
      .addField(
        `Members`,
        `${emojis.online} ${
          message.guild.members.cache.filter(
            (m) => m.presence.status === "online"
          ).size.toLocaleString()
        }
         ${emojis.idle} ${
          message.guild.members.cache.filter(
            (m) => m.presence.status === "idle"
          ).size.toLocaleString()
        }
         ${emojis.dnd} ${
          message.guild.members.cache.filter((m) => m.presence.status === "dnd")
            .size.toLocaleString()
        }
         ${emojis.offline} ${
          message.guild.members.cache.filter(
            (m) => m.presence.status === "offline"
          ).size.toLocaleString()
        }`,
        true
      )
      .addField(`⠀⠀`, `⠀`, true)
      .addField(
        `Channels`,
        `${emojis.hash} ${
          message.guild.channels.cache.filter((c) => c.type === "text").size
        }
         ${emojis.vc} ${
          message.guild.channels.cache.filter((c) => c.type === "voice").size
        }
         ${emojis.newsChannel} ${
          message.guild.channels.cache.filter((c) => c.type === "news").size
        }
        ${emojis.categories} ${
          message.guild.channels.cache.filter((c) => c.type === "category").size
        }`,
        true
      )
      .addField(
        `Others`,
        `${emojis.boost} Level ${message.guild.premiumTier}
        ${emojis.rr} ${message.guild.roles.cache.size.toLocaleString()} roles`,
        true
      )
      .addField(`⠀⠀`, `⠀`, true)
      .addField(
        `Created At`,
        `${emojis.timeout} ${moment(message.guild.createdAt).format(
          "dddd, MMMM Do YYYY"
        )}`
      )
      //.addField(`Special Features`, `${special.join("\n") || "No features"}`)
      .setColor(colors.darkPink)
      .setTimestamp();

    message.channel.send(embed);
  },
};
