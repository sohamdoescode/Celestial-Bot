const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  description: "Find the lyrics for a song",
  usage: "lyrics <song name>, <artist>",
  example: "lyrics Blinding Lights, The Weeknd",
  category: "Music",
  timeout: 7000,
  aliases: ["ly"],
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

    const total = args.slice(0).join(" ");

    const spiltted = total.split(", ");

    if (!spiltted[1])
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

    const lyrics =
      (await lyricsFinder(spiltted[1], spiltted[0])) || "No lyrics found";

    let firstContent = null;
    let secondContent = null;
    let thirdContent = null;
    const fourthContent = null;

    if (lyrics.length <= 2048) {
      firstContent = lyrics;
    } else if (lyrics.length > 2048 && lyrics.length <= 4096) {
      firstContent = lyrics.substr(0, 2048);
      secondContent = lyrics.substr(2048, lyrics.length);
    } else if (lyrics.length > 4096 && lyrics.length <= 6144) {
      firstContent = lyrics.substr(0, 2048);
      secondContent = lyrics.substr(2049, 4096);
      thirdContent = lyrics.substr(4096, lyrics.length);
    } else if (lyrics.length > 6144) {
      firstContent = lyrics.substr(0, 2048);
      secondContent = lyrics.substr(2048, 4096);
      thirdContent = lyrics.substr(4096, 6144);
      thirdContent = `${lyrics.substr(6144, 6700)}...`;
    }

    const embed = new Discord.MessageEmbed();
    const embed2 = new Discord.MessageEmbed();
    const embed3 = new Discord.MessageEmbed();
    const embed4 = new Discord.MessageEmbed(); // .setColor(colors.darkPink).setTitle(spiltted[0]+spiltted[1]).setFooter(`Requested by ${message.author.tag}`)

    if (firstContent !== null)
      embed
        .setDescription(firstContent)
        .setColor(colors.darkPink)
        .setTitle(`${spiltted[0]} - ${spiltted[1]}`);
    if (secondContent !== null)
      embed2.setDescription(secondContent).setColor(colors.darkPink);
    if (thirdContent !== null)
      embed3.setDescription(thirdContent).setColor(colors.darkPink);
    if (fourthContent !== null)
      embed4.setDescription(fourthContent).setColor(colors.darkPink);

    if (embed !== null) {
      message.channel.send(embed).catch((err) => {
        throw err;
      });
    }
    if (embed2 !== null && secondContent !== null) {
      message.channel.send(embed2).catch((err) => {
        throw err;
      });
    }
    if (embed3 !== null && thirdContent !== null) {
      message.channel.send(embed3).catch((err) => {
        throw err;
      });
    }
    if (embed4 !== null && fourthContent !== null) {
      message.channel.send(embed4).catch((err) => {
        throw err;
      });
    }
  },
};
