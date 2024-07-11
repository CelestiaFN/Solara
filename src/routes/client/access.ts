import app from "../..";

export default function () {
    app.post("/fortnite/api/game/v2/grant_access/*", async (c) => {
        c.json({});
        return c.status(204);
    });

    app.get("/fortnite/api/game/v2/enabled_features", async (c) => {
        return c.json([]);
    });

    app.get("/eulatracking/api/shared/agreements/fn*", async (c) => {
        return c.json({});
    });

    app.get("/fortnite/api/receipts/v1/account/*/receipts", (c) => {
        return c.json([]);
    });

    app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/*", async (c) => {
        c.header("Content-Type", "text/plain");
        return c.text("true");
    });

    app.post("/fortnite/api/game/v2/chat/*/*/*/pc", async (c) => {
        return c.json({ "GlobalChatRooms": [{ "roomName": "solaraglobal" }] })
    })

    app.post("/fortnite/api/game/v2/chat/*/recommendGeneralChatRooms/pc", async (c) => {
        return c.json({})
    })

    app.get("/presence/api/v1/_/*/last-online", async (c) => {
        return c.json({})
    })

    app.post("/datarouter/api/v1/public/data", async (c) => {
        return c.json([], 204);
    });

    app.get("/waitingroom/api/waitingroom", async (c) => {
        return c.json([], 204);
    })
}