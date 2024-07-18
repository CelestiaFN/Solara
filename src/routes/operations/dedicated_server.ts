import app from "../..";
import Profile from "../../database/models/profiles";
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/dedicated_server/*", verifyAuth, async (c) => {
        var profiles = await Profile.findOne({ accountId: c.req.param("accountId") }).lean();
        const profileId = c.req.query("profileId") as any;
        if (!profiles) return c.json({}, 400);

        let profile = profiles.profiles[profileId];

        let profileChanges = [];
        let Rvn = profile.rvn;

        profileChanges.push(
            {
                changeType: "fullProfileUpdate",
                profile: profile,
            },
        )

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: c.req.query("profileId"),
            profileChangesBaseRevision: Rvn,
            profileChanges: profileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1,
        });
    });
}