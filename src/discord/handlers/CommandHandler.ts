import {
  Collection,
  type CacheType,
  type Client,
  type CommandInteraction,
  type Interaction,
} from "discord.js";
import fs from "node:fs/promises";
import { join } from "node:path";
import User from "../../database/models/users";
import type { Command, ExtendedClient } from "../interfaces/ExtendedClient";
import axios from "axios";

export default async function CommandHandler(client: ExtendedClient) {
  const commandsDir = await fs.readdir(join(__dirname, "..", "commands"));
  const commands = commandsDir.filter((cmd) => cmd.endsWith(".ts"));

  Promise.all(
    commands.map(async (cmd) => {
      const { default: CommandClass } = await import(join(__dirname, "..", "commands", cmd));
      const CommandInstance = new CommandClass();

      client.commands.set(CommandInstance.data.name, CommandInstance);

      return CommandInstance.data;
    }),
  );

  client.on("interactionCreate" as any, async (interaction: CommandInteraction) => {
    if (!interaction.isCommand()) return;
  
    const { commandName } = interaction;
    const command = client.commands.get(commandName);
  
    if (!command) return;
  
    try {
      if (!interaction.deferred && !interaction.replied) {
        await command.execute(interaction, {});
        interaction.replied = true;
      }
    } catch (error) {
      console.error(error);
      interaction.reply("There was an error executing that command!");
    }
  });
  

  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const oldRoles = oldMember.roles.cache.map(role => role.id);
    const newRoles = newMember.roles.cache.map(role => role.id);
  
    const addedRoles = newRoles.filter(role => !oldRoles.includes(role));
    const removedRoles = oldRoles.filter(role => !newRoles.includes(role));
  
    if (addedRoles.length > 0 || removedRoles.length > 0) {
      const roles: { [key: string]: string } = {
        "1260791766601433269": "0", // member
        "1260793622648062063": "1", // server booster
        "1263582817242189914": "2", // urban donator
        "1263562145048690728": "3", // glimmer donator
        "1263577060555886614": "4", // harvester donator
        "1263573060234248253": "5", // legacy donator
        "1260967561911336970": "6", // content creator
        "1260791529996550204": "7", // support
        "1260791033009143859": "8", // moderator 
        "1260790404123721769": "9", // admin
        "1260816793660821514": "10", // manager
        "1260789391027212381": "11", // developer
        "1260791228233023591": "12", // co owner
        "1260788909781155902": "13" // owner 
      }
  
      const userInGuild = await newMember.guild.members.fetch(newMember.id);
  
      if (!userInGuild) {
        console.error("User not found in the guild");
        return;
      }
  
      const user = await User.findOne({ discordId: newMember.id });
  
      if (!user) {
        return;
      }
  
      const initialHighestRole = newRoles.find(role => roles.hasOwnProperty(role)) || null;
  
      const highestRole = newRoles.reduce((highest, role) => {
        if (highest === null) {
          return role;
        }
        return Number(roles[role as keyof typeof roles]) > Number(roles[highest as keyof typeof roles]) ? role : highest;
      }, initialHighestRole);
  
      if (highestRole) {
        const roleValue = roles[highestRole] || "0";
        user.role = roleValue;
  
        if (!user.isHarvester || !user.isLegacy || !user.isGlimmer || !user.isUrban || !user.isBooster) {
          user.isHarvester = false;
          user.isLegacy = false;
          user.isGlimmer = false;
          user.isUrban = false;
          user.isBooster = false;
        }

        if (addedRoles.includes("1260793622648062063")) {
          if (user.isBooster == false) {
            user.isBooster = true;
            await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/booster/${user.accountId}`);
          }
        }
        
        if (addedRoles.includes("1263582817242189914")) {
          if (user.isUrban == false) {
            user.isUrban = true
            await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/urban/${user.accountId}`);
          }
        }
    
        if (addedRoles.includes("1263562145048690728")) {
          if (user.isGlimmer == false) {
            user.isGlimmer = true
            await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/glimmer/${user.accountId}`);
          }
        }
    
        if (addedRoles.includes("1263577060555886614")) {
          if (user.isHarvester == false) {
            user.isHarvester = true
            await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/harvester/${user.accountId}`);
          }
        }
    
        if (addedRoles.includes("1263573060234248253")) {
          if (user.isLegacy == false) {
            user.isLegacy = true
            await axios.post(`http://127.0.0.1:21491/celestia/grant/donator/legacy/${user.accountId}`);
          }
        }
        
        await user.save();
      }
    }
  });
}
