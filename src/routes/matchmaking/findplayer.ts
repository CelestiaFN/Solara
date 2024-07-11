import app from "../..";
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.get("/fortnite/api/matchmaking/session/findPlayer/*", verifyAuth, async (c) => {
        return c.json([], 200)
    })
}