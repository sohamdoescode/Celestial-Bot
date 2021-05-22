const emojis = require('../../design/emojis'); 
const { MessageEmbed } = require('discord.js')
const colors = require('../../design/colors');

module.exports = async (giveaway, member, reaction)=>{
  member.send(
    new MessageEmbed()
    .setTitle(`Entry Confirmed`)
    .setColor(colors.darkPink)
    .setDescription(`Your entry for [**this giveaway**](${giveaway.messageURL}) has been confirmed `)
    .setTimestamp()
  ).catch(()=> null); 
}