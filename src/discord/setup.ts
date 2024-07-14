import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { ExtendedClient } from "./interfaces/ExtendedClient";
import type BaseCommand from "./helpers/BaseCommand";
import EventHandler from "./handlers/EventHandler";
import CommandHandler from "./handlers/CommandHandler";
import { config } from "..";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}) as ExtendedClient;

client.commands = new Collection<string, BaseCommand>();

EventHandler(client);
await CommandHandler(client);

client.login(config.BOT_TOKEN);