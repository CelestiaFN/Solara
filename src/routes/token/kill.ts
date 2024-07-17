import app from "../..";
import Tokens from "../../database/models/tokens";

export default function () {
    app.delete("/account/api/oauth/sessions/kill/:token", async (c) => {
        const token = c.req.param("token");
        await Tokens.findOneAndDelete({ token: token });
        return c.json([]);
    });
}