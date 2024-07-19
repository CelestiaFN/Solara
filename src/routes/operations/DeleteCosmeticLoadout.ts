import app from "../..";
import Profile from "../../database/models/profiles";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/DeleteCosmeticLoadout", async (c) => {
        var profiles = await Profile.findOne({ accountId: c.req.param("accountId") });
        const profileId = c.req.query("profileId") as any;
        if (!profiles) return c.json({}, 400);
        const body = await c.req.json()

        let profile = profiles.profiles[profileId];

        if (!profiles) {
            return c.json({}, 400);
        }

        let profileChanges = [];
        let Rvn = profile.rvn;

        let item;
        if (body.fallbackLoadoutIndex != -1) {
            item = profile.items[`Solara${body.fallbackLoadoutIndex - 1}-loadout`];
            profile.stats.attributes["active_loadout_index"] = body.fallbackLoadoutIndex;
            profile.stats.attributes["last_applied_loadout"] = `Solara${body.fallbackLoadoutIndex - 1}-loadout`;
            profile.items["loudout1"].attributes["locker_slots_data"] = item.attributes["locker_slots_data"];
            let n = item.attributes["locker_name"];
            profile.items[`Solara${body.fallbackLoadoutIndex - 1}-loadout`] = profile.items["sandbox_loadout"];
            profile.items[`Solara${body.fallbackLoadoutIndex - 1}-loadout`].attributes["locker_name"] = n;
        }
        
        var it = Object.entries(profile.items);
        profile.items = Object.fromEntries(it);
        profile.stats.attributes.loadouts.splice(body.index);

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
