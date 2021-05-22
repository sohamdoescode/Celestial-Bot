const talkedRecently = new Map();
const chalk = require("chalk");
const Discord = require("discord.js");
const {
  prefix
} = require("../../config/bot-settings.json");
const emojis = require("../../design/emojis");
const colors = require("../../design/colors");
const embeds = require("../../utils/functions/embeds");
const ms = require("ms");
const user = require("../../models/user");
const guild = require("../../models/guild");
const {
  stripIndents
} = require("common-tags")
const {
  ownerID
} = require("../../config/bot-settings.json");
global.prefixCache = new Map();
let guildPrefix;
//const ms = require('ms');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  if (message.guild) {
    //if prefix is cached

    if (prefixCache.has(message.guild.id)) {
      guildPrefix = prefixCache.get(message.guild.id);
    } else {
      await guild.findOne({
          GuildID: message.guild.id
        },

        async (err, data) => {
          if (err) return embeds.errEmbed(message, err.message);

          if (data) {
            if (data.Prefix !== null) {
              guildPrefix = await data.Prefix;

              prefixCache.set(message.guild.id, data.Prefix);

              setTimeout(() => {
                prefixCache.delete(message.guild.id);
              }, 900000);
            } else {
              guildPrefix = "?"; //default prefix
            }
          } else {
            guildPrefix = "?";
          }
        }
      );
    }

    if (message.content.toLowerCase().startsWith(guildPrefix)) {
      //check for start with prefix
      const args = message.content
        .slice(guildPrefix.length)
        .trim()
        .split(/ +/g); //splitting arguments - do not change unless you know what you are doing
      const cmd = args.shift().toLowerCase();

      if (cmd.length === 0) return;

      let command = client.commands.get(cmd); //getting from collection
      if (!command)
        command = client.commands.find(
          (com) => com.aliases && com.aliases.includes(cmd)
        );

      //cooldown exists

      if (command) {
        let isDisabled = false;

        if (command.category == "private" && message.author.id !== ownerID)
          return;

        await guild.findOne({
            GuildID: message.guild.id
          },
          async (err, data) => {
            if (err) throw err;

            if (data) {
              if (
                data.DisabledCommands.includes(command.name) ||
                data.DisabledCommands.includes(command.category)
              ) {
                return;
              } else {
                if (command.timeout && command.timeout !== null) {
                  if (
                    talkedRecently.has(`${message.author.id}_${command.name}`)
                  ) {
                    return embeds.coolDownEmbed(
                      message,
                      command.name,
                      ms(command.timeout, {
                        long: false
                      })
                    );
                  }

                  talkedRecently.set(`${message.author.id}_${command.name}`);
                  setTimeout(() => {
                    talkedRecently.delete(
                      `${message.author.id}_${command.name}`
                    );
                  }, command.timeout);

                  try {
                    await command.execute(
                      client,
                      message,
                      args,
                      Discord,
                      emojis,
                      colors,
                      embeds
                    );
                    console.log(
                      chalk.green(stripIndents `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] ${message.author.tag} executed ${chalk.yellowBright(command.name)} in ${chalk.yellow(message.guild.name)} (${message.guild.id})`)
                    )
                  } catch (err) {
                    await message.react(emojis.cross);
                    console.log(
                      chalk.redBright(
                        `Failed to execute ${cmd} - ${err.message}`
                      )
                    );
                  }
                }

                //no cooldown
                else {
                  try {
                    await command.execute(
                      client,
                      message,
                      args,
                      Discord,
                      emojis,
                      colors,
                      embeds
                    ); //executing command
                    console.log(
                      chalk.green(stripIndents `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] ${message.author.tag} executed ${chalk.yellowBright(command.name)} in ${chalk.yellow(message.guild.name)} (${message.guild.id})`)
                    )
                  } catch (err) {
                    await message.react(emojis.cross);
                    console.log(
                      chalk.redBright(`Failed to execute ${cmd} - ${err}`)
                    );
                  }
                }
              }
            } else {
              if (command.timeout && command.timeout !== null) {
                if (
                  talkedRecently.has(`${message.author.id}_${command.name}`)
                ) {
                  return embeds.coolDownEmbed(
                    message,
                    command.name,
                    ms(command.timeout, {
                      long: false
                    })
                  );
                }

                talkedRecently.set(`${message.author.id}_${command.name}`);
                setTimeout(() => {
                  talkedRecently.delete(`${message.author.id}_${command.name}`);
                }, command.timeout);

                try {
                  await command.execute(
                    client,
                    message,
                    args,
                    Discord,
                    emojis,
                    colors,
                    embeds
                  );
                  console.log(
                    chalk.green(stripIndents `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] ${message.author.tag} executed ${chalk.yellowBright(command.name)} in ${chalk.yellow(message.guild.name)} (${message.guild.id})`)
                  )
                } catch (err) {
                  await message.react(emojis.cross);
                  console.log(
                    chalk.redBright(`Failed to execute ${cmd} - ${err.message}`)
                  );
                }
              }

              //no cooldown
              else {
                try {
                  await command.execute(
                    client,
                    message,
                    args,
                    Discord,
                    emojis,
                    colors,
                    embeds
                  ); //executing command
                  console.log(
                    chalk.green(stripIndents `[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] ${message.author.tag} executed ${chalk.yellowBright(command.name)} in ${chalk.yellow(message.guild.name)} (${message.guild.id})`)
                  )
                } catch (err) {
                  await message.react(emojis.cross);
                  console.log(
                    chalk.redBright(`Failed to execute ${cmd} - ${err}`)
                  );
                }
              }
            }
          }
        );
      } else {
        await guild.findOne({
            GuildID: message.guild.id
          },
          async (err, data) => {
            if (err) throw err;
            if (data) {
              data.CustomCommands.forEach(async (custom) => {
                if (custom.name == cmd) {
                  if (custom.deleteInvoc == true)
                    message.delete().catch(() => null);
                  if (custom.embed == true) {
                    if (custom.dmResponse == true) {
                      message.author
                        .send(
                          new Discord.MessageEmbed()
                          .setDescription(custom.response)
                          .setColor(colors.darkPink)
                        )
                        .catch(() => null);
                      message.react(emojis.tick).catch(() => null);
                    } else {
                      message.channel
                        .send(
                          new Discord.MessageEmbed()
                          .setDescription(response)
                          .setColor(colors.darkPink)
                        )
                        .catch(() => null);
                    }
                  } else {
                    if (custom.dmResponse == true) {
                      message.author.send(custom.response).catch(() => null);
                      message.react(emojis.tick).catch(() => null);
                    } else {
                      message.channel.send(custom.response).catch(() => null);
                    }
                  }
                }
              });
            }
          }
        );
      }
    }
  }
};