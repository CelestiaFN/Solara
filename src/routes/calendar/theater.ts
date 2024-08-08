import app from "../..";

export default function () {
    app.get("/fortnite/api/game/v2/world/info", async (c) => {
        const theater = require("../../../static/data/theater.json")
        
        return c.json(theater, 200)
    })
}