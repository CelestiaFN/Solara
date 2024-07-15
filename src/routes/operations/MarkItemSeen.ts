import app from "../..";
import Profile from "../../database/models/profiles";
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/MarkItemSeen", verifyAuth, async (c) => {
        try {
            const body = await c.req.json()
            const query = await c.req.query()
            let profiles = await Profile.findOne({ accountId: c.req.param("accountId") }) as any;

            let profile = profiles.profiles[query.profileId];

            if (!profile.items) {
                profile.items = {};
            }

            let profileChanges: any = [];
            const BaseRevision = profile.rvn;
            const QueryRevision = c.req.query("rvn") || -1;

            for (const itemId of body.itemIds) {
                if (!profile.items[itemId]) {
                    continue;
                }

                profile.items[itemId].attributes.item_seen = true;

                profileChanges.push({
                    changeType: "itemAttrChanged",
                    itemId,
                    attributeName: "item_seen",
                    attributeValue: true,
                });
            }
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({
                $set: { [`profiles.${query.profileId}`]: profile },
            });


            if (QueryRevision !== BaseRevision) {
                profileChanges = [
                    {
                        changeType: "fullProfileUpdate",
                        profile,
                    },
                ];
            }

            return c.json({
                profileRevision: profile.rvn || 0,
                profileId: c.req.query("profileId"),
                profileChangesBaseRevision: BaseRevision,
                profileChanges: profileChanges,
                profileCommandRevision: profile.commandRevision || 0,
                serverTime: new Date().toISOString(),
                responseVersion: 1,
            });
        } catch (error: any) {
            console.error(error);
            return c.json({ error: "Internal Server Error", message: error.message }, 500);
        }
    });
}