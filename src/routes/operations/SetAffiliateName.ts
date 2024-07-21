import app from "../..";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";
import Sac from "../../database/models/sac";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/SetAffiliateName", async (c) => {
        const profiles = await Profile.findOne({
            accountId: c.req.param("accountId"),
        });

        const body = await c.req.json();
        const query = await c.req.query();

        if (!profiles) return c.json(Solara.account.accountNotFound, 404);

        const profile = profiles?.profiles[query.profileId];

        let profileChanges = [];

        const code = await Sac.findOne({
            code_l: body.affiliateName.toLowerCase(),
        });

        if (!code && body.affiliateName !== "") return c.json(Solara.mcp.missingPermission, 404);

        profile.stats.attributes.mtx_affiliate_set_time = new Date().toISOString();
        profile.stats.attributes.mtx_affiliate = body.affiliateName;

        profile.rvn += 1;
        profile.commandRevision += 1;

        profileChanges.push({
            changeType: "statModified",
            name: "mtx_affiliate_set_time",
            value: profile.stats.attributes.mtx_affiliate_set_time,
        });

        profileChanges.push({
            changeType: "statModified",
            name: "mtx_affiliate",
            value: profile.stats.attributes.mtx_affiliate,
        });

        await profiles.updateOne({
            $set: { [`profiles.${query.profileId}`]: profile },
        });

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: query.profileId,
            profileChangesBaseRevision: profile.rvn,
            profileChanges: profileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1,
        });
    });
}
