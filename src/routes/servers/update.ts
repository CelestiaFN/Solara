import app from "../..";
import { Solara } from "../../utils/errors/Solara";
import Servers from "../../database/models/servers";

export default function () {
    app.post("/celestia/api/server/update", async (c) => {
        const { State, Region, Playlist, Players, SessionId } = await c.req.json();

        if (!Region || !Playlist || !SessionId) {
            return c.json(Solara.internal.jsonParsingFailed, 404)
        }

        if (State == "ENDED") {
            await Servers.deleteOne({ sessionId: SessionId })
        }

        await Servers.findOneAndUpdate(
            { sessionId: SessionId },
            {
                sessionId: SessionId,
                region: Region,
                playlist: Playlist,
                state: State || "AVAILABLE",
                players: Players || 0,
                playercap: 100,
                startedAt: new Date().toISOString()
            },
            { upsert: true, new: true }
        );

        return c.json(await Servers.findOne({ sessionId: SessionId }), 200)
    })
}