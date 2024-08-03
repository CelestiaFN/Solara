import { ActivityType, Client } from "discord.js";
import logger from "../../utils/logger/logger";
import { config } from "../..";

export default class ReadyEvent {
  name = "ready";
  once = false;

  execute(client: Client) {
    logger.startup(`Logged in as ${client.user?.username}`);

    const updateActivity = async () => {
      try {
        const response = await fetch(`http://${config.ElixionIP}:8080/clients`);
        const data = await response.json();
        const clients = data.amount;

        client.user?.setActivity({
          name: `${clients} ${clients === 1 ? 'Player' : 'Players'}`,
          type: ActivityType.Watching,
        });
      } catch (error) {
        logger.error("Failed to fetch client count:", error);
      }
    };

    updateActivity();

    setInterval(updateActivity, 60000);
  }
}