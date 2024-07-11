import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform", verifyAuth, async (c) => {
        try {
            const { profileId, rvn } = c.req.query()
            var profiles: any = await Profile.findOne({ accountId: c.req.param("accountId") });
            let profile = profiles?.profiles[profileId];
            if (!profile) return c.json(Solara.mcp.profileNotFound, 404)
            const ver: any = getVersion(c);
            let MultiUpdate: any = [];
            let profileChanges: any = [];
            let BaseRevision = profile.rvn;
            let ProfileRevisionCheck =
                ver.build >= 12.2 ? profile.commandRevision : profile.rvn;
            let QueryRevision = rvn || -1;

            if (QueryRevision != ProfileRevisionCheck) {
                profileChanges = [
                    {
                        changeType: "fullProfileUpdate",
                        profile: profile,
                    },
                ];
            }

            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();
            await Profile.updateOne({ accountId: c.req.param("accountId") }, { $set: { [`profiles.${profileId}`]: profile } });

            return c.json({
                profileRevision: profile.rvn || 0,
                profileId: profileId,
                profileChangesBaseRevision: BaseRevision,
                profileChanges: profileChanges,
                profileCommandRevision: profile.commandRevision || 0,
                serverTime: new Date().toISOString(),
                multiUpdate: MultiUpdate,
                responseVersion: 1,
            });
        } catch (error) {
            console.error(error);
        }
    });
}
