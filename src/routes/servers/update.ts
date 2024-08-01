import app from "../..";
import { Solara } from "../../utils/errors/Solara";
import Servers from "../../database/models/servers";

export default function () {
    app.post("/celestia/api/server/update", async (c) => {
        const { State, Region, Playlist, Players, Session } = await c.req.json();

        if (!Region || !Playlist || !Session) {
            return c.json(Solara.internal.jsonParsingFailed, 404)
        }

        if (State === "ENDED") {
            await Servers.deleteOne({ sessionId: Session })
        }

        await Servers.findOneAndUpdate(
            { sessionId: Session },
            {
                sessionId: Session,
                region: Region,
                playlist: Playlist,
                state: State || "AVAILABLE",
                players: Players || 0,
                playercap: 100,
                startedAt: new Date().toISOString()
            },
            { upsert: true, new: true }
        );

        return c.json(await Servers.findOne({ sessionId: Session }), 200)
    })
}