const game = require("koenie06-games");
const TTT = new game.TicTacToe();

module.exports = {
  name: "tictactoe",
  description: "Play tictactoe with someone",
  usage: "tictactoe <@user>",
  example: "tictactoe @zhue",
  category: "Fun",
  timeout: 15000,
  aliases: [],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if(!args[0]){
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
    } 
    const member = message.mentions.members.first(); 
    if(!member){
      return embeds.errEmbed(message, "Specified user not found in the guild"); 
    }
    TTT.newGame(message)
  },
};
