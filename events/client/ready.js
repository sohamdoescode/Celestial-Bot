const chalk = require("chalk");
const {
  prefix
} = require("../../config/bot-settings.json");
let now = new Date();
const mongoose = require("mongoose");
const {
  mongoPass
} = require("../../config/bot-settings.json");
const {
  stripIndents
} = require('common-tags')

global.lastRestart = now.toLocaleDateString() + " - " + now.toLocaleTimeString();

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 60000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

module.exports = async (client) => {

  console.log(
    chalk.greenBright(
      stripIndents `
      [${now.toLocaleDateString()} - ${now.toLocaleTimeString()}] Logged in as ${
     client.user.tag
   }
      [${now.toLocaleDateString()} - ${now.toLocaleTimeString()}] Guilds   : ${client.guilds.cache.size.toLocaleString()}
      [${now.toLocaleDateString()} - ${now.toLocaleTimeString()}] Users    : ${client.guilds.cache.reduce(
     (users, value) => users + value.memberCount,
     0
   )}
      [${now.toLocaleDateString()} - ${now.toLocaleTimeString()}] Channels : ${client.channels.cache.size.toLocaleString()}`
    )
  );

  //client.user.setActivity(`${prefix}help | ${prefix}invite`);
  //client.user.setStatus('dnd')

  mongoose
    .connect(mongoPass, mongoOptions)
    .then(() => {
      console.log(
        chalk.cyanBright(stripIndents `
       [${now.toLocaleDateString()} - ${now.toLocaleTimeString()}] Connected to MongoDB
      `)
      );
    })
    .catch((err) => {
      console.log(
        chalk.redBright(stripIndents `
       [${now.toLocaleDateString()} - ${now.toLocaleTimeString()}] (MONGOOSE) ${
          err.message
        }
      `)
      );
    });
};