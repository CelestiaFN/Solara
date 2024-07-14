import { ActivityType, type Client } from "discord.js";
import logger from "../../utils/logger/logger";

export default class ReadyEvent {
  name = "ready";
  once = false;

  execute(client: Client) {
    logger.startup(`Logged in as ${client.user?.username}`);
    client.user?.setActivity({
      name: "Celestia",
      type: ActivityType.Playing,
    });
  }
}