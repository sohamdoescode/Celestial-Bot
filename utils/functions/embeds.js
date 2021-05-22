const colors = require("../../design/colors");
const emojis = require("../../design/emojis");
const ms = require("ms");
const {
  MessageEmbed
} = require("discord.js");
const links = require("../../design/directLinks.json");
const Discord = require("discord.js")

/**
 * 
 * @param {Discord.Message} message 
 * @param {String} error 
 */
function errEmbed(message, error) {
  const errorEmbed = new MessageEmbed()
    //.addField(`${emojis.cross} Error`, `${error}\nFor further help join the [support server](${links.supportServer})`)
    .setColor(colors.red)
    .setDescription(`${emojis.cross} **Error** : ${error}`);
  message.lineReplyNoMention(errorEmbed).catch((err) => {
    console.log(err.message);
  });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {String} name 
 * @param {String} desc 
 * @param {String} cat 
 * @param {String} usage 
 * @param {String} example 
 * @param {Array} aliases 
 * @param {Number} timeout 
 */
function infoEmbed(message, name, desc, cat, usage, example, aliases, timeout) {
  const infoEmbed = new MessageEmbed()
    .setAuthor(name)
    .addField(`${emojis.drop} Description`, `${desc}`)
    .addField(`${emojis.category} Category`, `${cat}`)
    .addField(`${emojis.question} Usage`, `\`${usage}\``)
    .addField(`${emojis.hash} Example`, `\`${example}\``)
    .addField(
      `${emojis.folder_icon} Aliases`,
      `\`${aliases.join(", ") || "none"}\``
    )
    .addField(
      `${emojis.timeout} Cooldown`,
      `\`${`${ms(timeout, { long: true })}` || "none"}\``
    )
    .setColor(colors.darkPink)
    .setTimestamp();
  message.lineReplyNoMention(infoEmbed).catch((err) => {
    console.log(err.message);
  });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {String} display 
 */
function sucEmbed(message, display) {
  const success = new MessageEmbed()
    .setDescription(`${emojis.tick} ${display}`)
    .setColor(colors.green);
  message.lineReplyNoMention(success).catch((err) => {
    console.log(err.message);
  });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {String} display 
 */
function sucEmbedNoLine(message, display) {
  const success = new MessageEmbed()
    .setDescription(`${emojis.tick} ${display}`)
    .setColor(colors.green);
  message.channel.send(success).catch((err) => {
    console.log(err.message);
  });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {String} command 
 * @param {String} cooldown 
 */
function coolDownEmbed(message, command, cooldown) {
  const slowDown = new MessageEmbed()
    .setDescription(
      `${emojis.timeout} **Slow down** : The **${command}** command has a cooldown of \`${cooldown}\``
    )
    .setColor(colors.coolDown);

  message.lineReplyNoMention(slowDown).catch(() => null);
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {String} permissions 
 */
function permErr(message, permissions) {
  const perms = new MessageEmbed()
    .setTitle(`${emojis.cross} Missing permissions`)
    .setDescription(
      `You are missing the permission(s) required to use that command`
    )
    .addField(
      `${emojis.folder_icon} Default Required Permissions`,
      `\`${permissions.toUpperCase()}\``
    )
    .setColor(colors.orange)
    .setFooter("Additional role restrictions may be set in this guild too");

  message.lineReplyNoMention(perms).catch((err) => {
    console.log(err.message);
  });
}

/**
 * 
 * @param {Discord.Message} messageToEdit 
 * @param {String} newDesc to display on new embed 
 */
async function editEmbed(messageToEdit, newDesc) {
  if (typeof messageToEdit === "undefined") return
  messageToEdit.edit(
    new MessageEmbed()
    .setAuthor("Giveaway Setup")
    .setDescription(newDesc.toString())
    .setColor(colors.darkPink)
    .setFooter(`Type "cancel" to cancel`)
  ).catch(() => null)
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {String} error 
 */
async function disappearingErrEmbed(message, error) {
  const errorEmbed = new MessageEmbed()
    //.addField(`${emojis.cross} Error`, `${error}\nFor further help join the [support server](${links.supportServer})`)
    .setColor(colors.red)
    .setDescription(`${emojis.cross} **Error** : ${error}`);
  message.channel.send(errorEmbed).then((m) => {
    setTimeout(() => {
      m.delete().catch(()=> null)
    }, 5000)
  }).catch(()=> null)
}

module.exports = {
  errEmbed,
  infoEmbed,
  sucEmbed,
  sucEmbedNoLine,
  permErr,
  coolDownEmbed,
  editEmbed, 
  disappearingErrEmbed
};