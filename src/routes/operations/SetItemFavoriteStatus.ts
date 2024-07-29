import app from "../../";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/SetItemFavoriteStatus", verifyAuth, async (c) => {
        const profiles = await Profile.findOne({
            accountId: c.req.param("accountId"),
        });

        const query = await c.req.query();
        const body = await c.req.json();

        if (!profiles) return c.json(Solara.account.accountNotFound, 404);

        const profile = profiles.profiles[query.profileId];

        var profileChanges: any[] = [];
        var rvn = query.rvn || -1;

        if (body.targetItemId) {
            profile.items[body.targetItemId].attributes.favorite = body.bFavorite || false;
        }

        profile.rvn += 1;
        profile.commandRevision += 1;

        profileChanges.push({
            changeType: "itemAttrChanged",
            itemId: body.targetItemId,
            attributeName: "favorite",
            attributeValue: profile.items[body.targetItemId].attributes.favorite,
        });


        if (rvn != profile.rvn) {
            profileChanges = [
                {
                    changeType: "fullProfileUpdate",
                    profile: profile,
                },
            ];
        }
        await profiles?.updateOne({ $set: { [`profiles.${c.req.query("profileId")}`]: profile } });

        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: query.profileId || "athena",
            profileChangesBaseRevision: profile.rvn,
            profileChanges: profileChanges,
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1,
        });
    });
}
