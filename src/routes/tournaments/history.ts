import app from "../..";

export default function () {
    app.get("/api/v1/events/Fortnite/:eventId/history/:accountId", async (c) => {
        return c.json([])
    })
}