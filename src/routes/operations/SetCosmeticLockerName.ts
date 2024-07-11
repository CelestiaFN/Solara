import app from "../..";
import Profile from "../../database/models/profiles";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerName", async (c) => {
        var profiles = await Profile.findOne({ accountId: c.req.param("accountId") }).lean();
        const profileId = c.req.query("profileId") as any;
        if (!profiles) return c.json({}, 400);
        const body = await c.req.json()

        let profile = profiles.profiles[profileId];

        let profileChanges = [];
        let Rvn = profile.rvn;

        const item2 = profile.items[body.lockerItem];

        if (typeof body.name === "string" && item2.attributes.locker_name != body.name) {

            let attrItem = profile.items[body.lockerItem]
            let attrName = "locker_name"

            if (!item2) {
                return;
            }

            if (!item2.attributes) {
                item2.attributes = {};
            }

            item2.attributes[attrName] = body.name;

            profileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": body.lockerItem,
                "itemName": item2.templateId,
                "item": item2
            });
        }


        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await Profile.updateOne({ accountId: c.req.param("accountId") }, { $set: profiles as any }, { upsert: true });

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
