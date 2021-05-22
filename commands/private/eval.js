const settings = require('../../config/bot-settings.json');

module.exports = {
  name: 'eval',
  description: '',
  usage: '',
  example: '',
  category: 'private',
  timeout: 0000,
  aliases: [],

  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if (message.author.id !== settings.ownerID) return;

    const clean = (text) => {
      if (typeof text === 'string') {
        return text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203));
      } else return text;
    };

    try {
      const code = args.join(' ');
      let evaled = eval(code);

      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled); // eval

      message.channel.send(clean(evaled), {code: 'xl'});
    } catch (err) {
      message.channel.send(
          new Discord.MessageEmbed()
              .setTitle('Error').setDescription(`\`\`\`xl\n${clean(err)}\n\`\`\``).setColor(colors.red),
      );
    }
  },
};
