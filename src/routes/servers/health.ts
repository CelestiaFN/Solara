import app from "../..";
import Servers from "../../database/models/servers";

export default function () {
  app.get("/api/launcher/health", async (c) => {
    const allServers = await Servers.find({})

    return c.json({
      servers: allServers,
    });
  });
}
