import app from "../../";
import getVersion from "../../utils/functions/getVersion";
import Stats from "../../database/models/stats";
import User from "../../database/models/users";
import fs from 'node:fs'
import path from 'node:path'

export default function () {
  app.get("/api/v1/events/Fortnite/download/:accountid", async (c) => {
    const ver = getVersion(c);

    if (!(c.req.param("accountid") === "0cdf98f06c78488eae5574dc35fe68e3")) {
      return c.json([])
    }

    try {
      let stats = await Stats.findOne({ accountId: c.req.param("accountid") });
      const user = await User.findOne({ accountId: c.req.param("accountid") });
      const eventsData = await fs.readFileSync(
        path.join(__dirname, "..", "..", "..", "static", "events", "arena", "events.json"),
        "utf-8",
      );
      const events = JSON.parse(eventsData);

      const arenaTemplatesData = await fs.readFileSync(
        path.join(__dirname, "..", "..", "..", "static", "events", "arena", "template.json"),
        "utf-8",
      );
      const arenaTemplates = JSON.parse(arenaTemplatesData);

      if (!stats) {
        stats = new Stats({
          created: new Date().toISOString(),
          accountId: c.req.param("accountId"),
        })
      }

      if (!stats.arena) {
        stats.arena = {
          hype: 0,
          kills: 0,
          matchplayed: 0,
          wins: 0
        }
      }

      const arena = {
        events,
        player: {
          accountId: user?.accountId,
          gameId: "Fortnite",
          groupIdentity: {},
          pendingPayouts: [],
          pendingPenalties: {},
          persistentScores: {
            Hype: stats?.arena.hype,
          },
          teams: {
            "epicgames_Arena_S13_Solo:Arena_S13_Division1_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division2_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division3_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division4_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division5_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division6_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division7_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division8_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division9_Solo": [user?.accountId],
            "epicgames_Arena_S13_Solo:Arena_S13_Division10_Solo": [user?.accountId],
          },
          tokens: [
            `ARENA_S${ver.season}_Division1`,
          ],
        },
        templates: arenaTemplates,
      }
      return c.json(arena);
    } catch (error) {
      console.error(error)
      return c.json([], 200)
    };
  });
}
