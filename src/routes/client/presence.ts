import app from "../..";

export default function () {
    app.get("/presence/api/v1/*", async (c) => {
        return c.json([])
    });

    app.post("/api/v1/user/setting", async (c) => {
        return c.json([]);
    });
}