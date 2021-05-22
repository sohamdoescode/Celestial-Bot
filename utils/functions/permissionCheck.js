const guild = require("../../models/guild");

async function isMod(client, message, extraPerm) {
  if (!message.member) return;
  if (!message.guild) return;

  let permCheckMod = false;
  if (message.author.id === message.guild.ownerID) permCheckMod = true;

  await guild.findOne({
    GuildID: message.guild.id
  }, async (err, data) => {


    if (err) throw err;

    if (data) {
      //Check for Mod-Roles
      if (data.ModRoles.length) {
        for (let i = 0; i <= data.ModRoles.length; i++) {
          if (message.member.roles.cache.has(data.ModRoles[i])) {
            permCheckMod = true;
          }
        }
      }

      //Check for Admin-Roles (DEFAULT OVERRIDE)
      if (data.AdminRoles.length) {
        for (let j = 0; j <= data.AdminRoles.length; j++) {
          if (message.member.roles.cache.has(data.AdminRoles[j])) {
            permCheckMod = true;
          }
        }
      }

      //Check for bypassing default perm
      if (
        message.member.hasPermission("ADMINISTRATOR") ||
        message.member.hasPermission(extraPerm)
      ) {
        permCheckMod = true;
      }
    }

    //no data
    else {
      //check for bypassing default perm
      if (
        message.member.hasPermission("ADMINISTRATOR") ||
        message.member.hasPermission(extraPerm)
      ) {
        permCheckMod = true;
      }
    }

    return permCheckMod;

  });


}

async function isAdmin(client, message) {
  if (!message.member) return;
  if (!message.guild) return;

  let permCheckAdmin = false;
  if (message.author.id === message.guild.ownerID) permCheckAdmin = true;

  const guildData = await guild.findOne({ GuildID : message.guild.id })
  if(!guildData) {
    if(message.member.hasPermission("ADMINISTRATOR")) {
      permCheckAdmin = true
    }
  } else {
    if(guildData.AdminRoles.length) {
      guildData.AdminRoles.forEach((aRole)=>{
        if(message.member.roles.cache.has(aRole)) {
          permCheckAdmin = true
        }
      })
    }
    if(message.member.hasPermission("ADMINISTRATOR")) {
      permCheckAdmin = true
    }
  }

  return permCheckAdmin
}

async function isBotManager(client, message) {
  if (!message.member) return;
  if (!message.guild) return;

  let permCheckBM = false;
  if(message.author.id === message.guild.ownerID) {
    permCheckBM = true
  }  
  const guildData = await guild.findOne({ GuildID : message.guild.id }); 
  if(!guildData) {
    if(message.member.hasPermission("ADMINISTRATOR")) {
      permCheckBM = true
    }
  } else {
    if(guildData.BotManagers.length) {
      guildData.BotManagers.forEach((bmRole)=>{
        if(message.member.roles.cache.has(bmRole)) {
          permCheckBM = true
        }
      })
    }
    if(message.member.hasPermission("ADMINISTRATOR")) {
      permCheckBM = true
    }
  }
  return permCheckBM; 

}

module.exports = {
  isMod,
  isAdmin,
  isBotManager,
};