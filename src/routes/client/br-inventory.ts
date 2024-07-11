import app from "../..";
import Profile from "../../database/models/profiles";
import Tokens from "../../database/models/tokens";
import verifyAuth from "../../utils/handlers/verifyAuth";
import { Solara } from "../../utils/errors/Solara";

export default function () {
    app.get("/fortnite/api/game/v2/br-inventory/account/:accountId", verifyAuth, async (c) => {
        try {
            const profiles = await Profile.findOne({
                accountId: c.req.param("accountId"),
            });

            if (!profiles) {
                return c.json(Solara.mcp.profileNotFound, 404);
            }

            const athena = profiles.profiles.athena;

            if (!athena.stats.attributes.stash) {
                athena.stats.attributes.stash = {
                    globalcash: 0,
                };
            }

            return c.json({
                stash: {
                    globalcash: athena.stats.attributes.stash.globalcash,
                },
            });
        } catch (error) {
            return c.json(Solara.internal.unknownError, 500);
        }
    });
}