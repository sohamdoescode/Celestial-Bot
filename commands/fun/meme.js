const got = require("got");

module.exports = {
  name: "meme",
  description: "A fresh meme! Directly from Reddit",
  usage: "meme",
  example: "meme",
  category: "Fun",
  timeout: 4000,
  aliases: [],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    message.channel.startTyping();

    const embed = new Discord.MessageEmbed();

    got("https://www.reddit.com/r/memes/random/.json")
      .then(async (response) => {
        const content = JSON.parse(response.body);
        const { permalink } = content[0].data.children[0].data;
        const memeUrl = `https://reddit.com${permalink}`;
        const memeImage = content[0].data.children[0].data.url;
        const memeTitle = content[0].data.children[0].data.title;
        const memeUpvotes = content[0].data.children[0].data.ups;
        const memeNumComments = content[0].data.children[0].data.num_comments;

        embed.setTitle(`${memeTitle}`);
        embed.setURL(`${memeUrl}`);
        embed.setColor("RANDOM");
        embed.setImage(memeImage);
        embed.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`);

        await message.channel.send(embed);
      })
      .catch(console.error);

    message.channel.stopTyping();
  },
};
