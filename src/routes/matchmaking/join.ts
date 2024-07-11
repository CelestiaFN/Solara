import app from "../..";
import Matchmaking from "../../database/models/matchmakingsessions";

export default function () {
    app.post("/fortnite/api/matchmaking/session/:sessionId/join", async (c) => {
        const sessionId = c.req.param("sessionId");
        await Matchmaking.deleteOne({ sessionId });
        return c.text('', 200);
    });
}