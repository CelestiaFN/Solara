import app from "../..";

export default function () {
    app.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", async (c) => {
        return c.json({
            accountId: c.req.param("accountId"),
            sessionId: c.req.param("sessionId"),
            key: "none",
        });
    }
    );
}