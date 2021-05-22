const fs = require("fs");
const chalk = require("chalk");
let now = new Date();
const { stripIndents } = require('common-tags')

module.exports = (client) => {
  fs.readdirSync("./commands/").map((dir) => {
    fs.readdirSync(`./commands/${dir}/`).map((cmd) => {
      let pull = require(`../commands/${dir}/${cmd}`);

      console.log(
        chalk.magentaBright(
          stripIndents`[${now.toLocaleDateString()} - ${now.toLocaleTimeString()}] -:- Loaded - ${
            pull.name
          }`
        )
      );

      client.commands.set(pull.name, pull);

      if (pull.aliases) {
        pull.aliases.map((p) => client.aliases.set(p, pull));
      }
    });
  });
};
