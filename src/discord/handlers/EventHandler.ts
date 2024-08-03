import { Client } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { Event } from "../interfaces/Event";

export default async function EventHandler(client: Client) {
  const events = readdirSync(join(__dirname, "..", "events")).filter((event) =>
    event.endsWith(".ts"),
  );

  for (const event of events) {
    const EventModule = await import(join(__dirname, "..", "events", event));
    const EventClass = EventModule.default;
    const EventInstance = new EventClass() as Event;

    if (EventInstance.once)
      client.once(EventInstance.name, (...args) => EventInstance.execute(...args, client));
    else client.on(EventInstance.name, (...args) => EventInstance.execute(...args, client));
  }
}
