const axios = require("axios");

module.exports = {
  name: "color",
  description: "Get information on a color",
  usage: "color [hex]",
  example: "color #ff0000",
  category: "Utility",
  timeout: 4000,
  aliases: ["colorpreview"],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    let color;
    if (!args[0]) {
      color = message.member.displayHexColor;
    } else {
      if (/(#|0x)([0-9A-F]{6})/i.test(args[0])) {
        color = args[0].match(/(#|0x)([0-9A-F]{6})/i)[2];
      } else {
        return embeds.errEmbed(
          message,
          "You must specify a valid hex color code"
        );
      }
    }
    message.channel.startTyping();
    const aa = color.replace("#", "", "0x", "");
    const colour = await axios.get(
      `https://www.thecolorapi.com/scheme?hex=${aa}`
    );

    const colorEmbed = new Discord.MessageEmbed()
      .setColor(colour.data.seed.hex.value)
      .setTitle(`Color Information : ${colour.data.seed.hex.value}`)
      .setDescription(
        `**Hex** : \`${colour.data.seed.hex.value}\`\n**RGB** : \`${colour.data.seed.rgb.value}\``
      );
    message.channel.send(colorEmbed).catch((err) => {
      console.log(err);
    });

    message.channel.stopTyping();
  },
};
