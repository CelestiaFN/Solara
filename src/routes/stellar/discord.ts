import app from "../..";

export default function () {
    app.get("/api/oauth/discord", async (c) => {
        return c.redirect("https://discord.com/oauth2/authorize?client_id=1257854812767125504&response_type=code&redirect_uri=https%3A%2F%2FHydro.itztiva.com%2Fapi%2Foauth%2Fdiscord%2Fcallback%2F&scope=identify+guilds");
    });
}