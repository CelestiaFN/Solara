import app from "../..";
import Profile from "../../database/models/profiles";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/SetBattleRoyaleBanner", async (c) => {
        const accountId = c.req.param("accountId")
        const profiles: any = await Profile.findOne({ accountId: accountId })
        const body: any = await c.req.json()
    
        let profileChanges = [];
    
        try {
            profiles.profiles.athena.stats.attributes.banner_icon = body.homebaseBannerIconId;
            profiles.profiles.athena.stats.attributes.banner_color = body.homebaseBannerColorId;
    
            profileChanges.push({
                "changeType": "statModified",
                "name": "banner_icon",
                "value": profiles.profiles.athena.stats.attributes.banner_icon
            });
    
            profileChanges.push({
                "changeType": "statModified",
                "name": "banner_color",
                "value": profiles.profiles.athena.stats.attributes.banner_color
            });

            profiles.profiles.athena.rvn += 1;
            profiles.profiles.athena.commandRevision += 1;
            profiles.profiles.athena.updated = new Date().toISOString();
    
            profiles.markModified('profiles')
    
            await profiles.save();
            return c.json({
                profileRevision: profiles.profiles.athena.rvn || 0,
                profileId: c.req.query("profileId"),
                profileChangesBaseRevision: profiles.profiles.athena.rvn,
                profileChanges: profileChanges,
                profileCommandRevision: profiles.profiles.athena.commandRevision || 0,
                serverTime: new Date().toISOString(),
                responseVersion: 1
            });
        } catch (error) {
            console.error(error)
        }
    });

    
}