import app from "../..";

export default function () {
    app.get("/fortnite/api/game/v2/privacy/account/:accountId", async (c) => {
        return c.json({
            accountId: c.req.param("accountId"),
            optOutOfPublicLeaderboards: false,
        });
    });
}