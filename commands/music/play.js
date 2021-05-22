module.exports = {
  name: "play",
  description: "Play music into a voice channel",
  usage: "play <song name>",
  example: "play Alone - Marshmello",
  category: "Music",
  timeout: 1000,
  aliases: ["p", "playmusic"],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (!message.member.voice.channel)
      return embeds.errEmbed(
        message,
        "You need to be in a voice channel to use this command"
      );
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

    const song = args.slice(0).join(" ");
    //await message.member.voice.channel.join().then((connection) => {
      //connection.voice.setSelfDeaf(true);
    //});
    const searching = await message.channel.send(
      new Discord.MessageEmbed()
      .setDescription(`${emojis.youtube} Searching YouTube for **${args.slice(0).join(" ")}**`)
      .setColor(colors.darkPink)
    )
    await client.distube.play(message, song);
    await searching.delete().catch(()=> null)
  },
};
