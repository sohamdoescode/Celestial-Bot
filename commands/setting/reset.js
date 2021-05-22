const guild = require('../../models/guild'); 

module.exports = {
  name: "reset",
  description: "Reset all settings of the bot to its default. This action is irreversible",
  usage: "reset",
  example: "reset",
  category: "Settings",
  timeout: 60000,
  aliases: ['factoryreset'],
  async execute(client, message, args, Discord, emojis, colors, embeds) {
    if(message.author.id !== message.guild.ownerID){
      return embeds.errEmbed(message, "This command is restricted to the owner of this guild"); 
    }
    guild.findOne({ GuildID : message.guild.id }, async(err, data)=>{
      if(err){
        throw err; 
      }
      if(data){
      } else {
        return embeds.errEmbed(message, "No custom settings seem to be set up in this guild"); 
      }
    })
  },
};
