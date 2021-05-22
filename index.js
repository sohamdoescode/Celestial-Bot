require("discord-reply");
const { Client, Collection } = require("discord.js");
const client = new Client({
  disableEveryone: false,
});
const { token, prefix, ownerID } = require("./config/bot-settings.json");
const fs = require("fs");
const chalk = require("chalk");
const now = new Date();
const Distube = require("distube");
const { GiveawaysManager } = require("discord-giveaways");
const logs = require('discord-logs'); 
logs(client); 

const manager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 60000,
  endedGiveawaysLifetime: 3024000000, // 35 days
  hasGuildMembersIntent: true,
  default: {
    botsCanWin: false,
    exemptPermissions: [],
    embedColorEnd: "#36393e",
    reaction: "🎉",
  },
});

// client vars
client.commands = new Collection();
client.giveawaysManager = manager;
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.distube = new Distube(client, {
  searchSongs: false,
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
});

// events
client.on("ready", () => require("./events/client/ready")(client));
client.on("message", (message) => {
  require("./events/server/message")(client, message);
});
require("./utils/command-handler")(client);
client.on("error", (err) => {
  console.log(
    chalk.redBright(
      `${now.toLocaleDateString()}-${now.toLocaleTimeString()} -:- ${
        err.message
      }`
    )
  );
});

/**
 * GIVEAWAY
 */
manager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  require("./events/giveaway/giveawayReactionAdded")(
    giveaway,
    member,
    reaction
  );
});

// music
client.distube
  .on("playSong", (message, queue, song) =>
    require("./events/music/playSong")(message, queue, song)
  )
  .on("addSong", (message, queue, song) =>
    require("./events/music/addSong")(message, queue, song)
  )
  .on("error", (message, err) => require("./events/music/error")(message, err))
  .on("playList", (message, queue, playlist, song) =>
    require("./events/music/playList")(message, queue, playlist, song)
  )
  .on("addList", (message, queue, playlist) =>
    require("./events/music/addList")(message, queue, playlist)
  )
  .on("empty", (message) => require("./events/music/empty")(message));

/**
 * LOGS
 */
client.on("messageDelete", (message) => {
  require("./events/server/messageDelete")(client, message);
});
client.on("messageContentEdited", (message, oldContent, newContent)=>{
  require("./events/server/messageContentEdited")(message, oldContent, newContent); 
})

// login
client.login(token);
