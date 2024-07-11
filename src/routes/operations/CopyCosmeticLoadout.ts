import app from "../..";
import Profile from "../../database/models/profiles";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/CopyCosmeticLoadout", async (c) => {
        var profiles = await Profile.findOne({ accountId: c.req.param("accountId") });
        const profileId = c.req.query("profileId") as any;
        if (!profiles) return c.json({}, 400);
        const body = await c.req.json()
        console.log(body, c.req.param("accountId"))

        let profile = profiles.profiles[profileId];

        if (!profiles) {
            return c.json({}, 400);
        }

        let profileChanges = [];
        let Rvn = profile.rvn;

        let item;
        if (body.sourceIndex == 0) {
            item = profile.items[`Solara${body.targetIndex - 1}-loadout`];
            if (!item) {
                profile.items[`Solara${body.targetIndex - 1}-loadout`] = profile.items["loudout1"];
            }
            var item2 = profile.items[`Solara${body.targetIndex - 1}-loadout`];
            if (body.optNewNameForTarget != "") profile.items[`Solara${body.targetIndex - 1}-loadout`].attributes["locker_name"] = body.optNewNameForTarget;
            profile.stats.attributes.loadouts[body.targetIndex] = `Solara${body.targetIndex - 1}-loadout`;
            profile.stats.attributes["active_loadout_index"] = body.targetIndex;
            profile.stats.attributes["last_applied_loadout"] = `Solara${body.targetIndex - 1}-loadout`;
            profile.items["loudout1"].attributes["locker_slots_data"] = item2.attributes["locker_slots_data"];
        }
        else {
            item = profile.items[`Solara${body.sourceIndex - 1}-loadout`];
            profile.stats.attributes["active_loadout_index"] = body.sourceIndex;
            profile.stats.attributes["last_applied_loadout"] = `Solara${body.sourceIndex - 1}-loadout`;
            profile.items["loudout1"].attributes["locker_slots_data"] = item.attributes["locker_slots_data"];
            let name = item.attributes["locker_name"];
            profile.items[`Solara${body.sourceIndex - 1}-loadout`] = profile.items["loudout1"];
            profile.items[`Solara${body.sourceIndex - 1}-loadout`].attributes["locker_name"] = name;
        }

        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        profileChanges.push(
            {
                changeType: "fullProfileUpdate",
                profile: profile,
            },
        )

        await profiles?.updateOne({
            $set: { [`profiles.${profileId}`]: profile },
        });

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
