import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import Profile from "../../database/models/profiles";
import verifyAuth from "../../utils/handlers/verifyAuth";
import { Solara } from "../../utils/errors/Solara";
import { v4 } from "uuid";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin", verifyAuth, async (c) => {
        try {
            const { profileId, rvn } = c.req.query();
            const profiles = await Profile.findOne({ accountId: c.req.param("accountId") });
            const profile = profiles?.profiles.athena;
            if (!profile) return c.json(Solara.mcp.profileNotFound, 404);

            if (await c.req.json()) {
                console.log(await c.req.json())
            }

            let profileChanges = [];
            let BaseRevision = profile.rvn;

            profileChanges = [{ changeType: "fullProfileUpdate", profile }];
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });

            return c.json({
                profileRevision: profile.rvn || 0,
                profileId: profileId,
                profileChangesBaseRevision: BaseRevision,
                profileChanges: profileChanges,
                profileCommandRevision: profile.commandRevision || 0,
                serverTime: new Date().toISOString(),
                responseVersion: 1,
            });
        } catch (error) {
            console.error(error);
        }
    });
}
