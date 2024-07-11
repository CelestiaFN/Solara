import app from "../..";

export default function () {
    app.delete("/account/api/oauth/sessions/kill/:token", async (c) => {
        return c.json([]);
    });

    app.delete("/account/api/oauth/sessions/kill", async (c) => {
        return c.json([])
    });
}