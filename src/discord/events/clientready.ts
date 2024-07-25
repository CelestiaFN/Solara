import { ActivityType, Client } from "discord.js";
import logger from "../../utils/logger/logger";

export default class ReadyEvent {
  name = "ready";
  once = false;

  execute(client: Client) {
    logger.startup(`Logged in as ${client.user?.username}`);

    const updateActivity = async () => {
      try {
        const response = await fetch("http://34.150.153.214:8080/clients");
        const data = await response.json();
        const clients = data.amount;

        client.user?.setActivity({
          name: `${clients} Players`,
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