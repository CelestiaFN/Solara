import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import Profile from "../../database/models/profiles";
import { Solara } from "../../utils/errors/Solara";
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.post("/fortnite/api/game/v2/profile/:accountId/client/QueryProfile", verifyAuth, async (c) => {
        try {
            const { profileId, rvn } = c.req.query()
            var profiles: any = await Profile.findOne({ accountId: c.req.param("accountId") });
            let profile = profiles?.profiles[profileId];
            if (!profile) return c.json(Solara.mcp.profileNotFound, 404)
            if (profile.rvn == profile.commandRevision) {
                profile.rvn += 1;
                if (profileId == "athena") {
                    if (!profile.stats.attributes.last_applied_loadout)
                        profile.stats.attributes.last_applied_loadout =
                            profile.stats.attributes.loadouts[0];
                }
            }
            const ver: any = getVersion(c);
            let MultiUpdate: any = [];
            let profileChanges: any = [];
            let BaseRevision = profile.rvn;
            let ProfileRevisionCheck =
                ver.build >= 12.2 ? profile.commandRevision : profile.rvn;
            let QueryRevision = rvn || -1;

            if (ver.season == Bun.env.SEASON) {
                if (profiles &&
                    profiles.profiles &&
                    profiles.profiles.athena &&
                    profiles.profiles.athena.stats &&
                    profiles.profiles.athena.stats.attributes) {
                    profiles.profiles.athena.stats.attributes.season_num = ver.season;
                    if (profiles.profiles.athena.stats.attributes.past_seasons) {
                        const currentseason = profiles.profiles.athena.stats.attributes.past_seasons.find((season: any) => season.seasonNumber == Bun.env.SEASON);
                        if (currentseason) {
                            profiles.profiles.athena.stats.attributes.book_level = currentseason.bookLevel;
                            profiles.profiles.athena.stats.attributes.book_xp = currentseason.bookXp;
                            profiles.profiles.athena.stats.attributes.xp = currentseason.seasonXp;
                            profiles.profiles.athena.stats.attributes.book_purchased = currentseason.purchasedVIP;
                            profiles.profiles.athena.stats.attributes.level = currentseason.seasonLevel;
                            profiles.profiles.athena.stats.attributes.past_seasons = profiles.profiles.athena.stats.attributes.past_seasons.filter((season: any) => season.seasonNumber != Bun.env.SEASON);
                        }
                    }
                }
            } else if (profiles.profiles.athena.stats.attributes.season_num !== Bun.env.SEASON) {
                if (!profiles.profiles.athena.stats.attributes.past_seasons) {
                    profiles.profiles.athena.stats.attributes.past_seasons = [];
                }
                let pastSeasonExists = profiles.profiles.athena.stats.attributes.past_seasons.some((season: any) => season.seasonNumber == ver.season);
                if (!pastSeasonExists) {
                    profiles.profiles.athena.stats.attributes.past_seasons.push({
                        seasonNumber: profiles.profiles.athena.stats.attributes.season_num,
                        numWins: 0,
                        numHighBracket: 0,
                        numLowBracket: 0,
                        seasonXp: profiles.profiles.athena.stats.attributes.xp,
                        seasonLevel: profiles.profiles.athena.stats.attributes.level,
                        bookXp: profiles.profiles.athena.stats.attributes.book_xp,
                        bookLevel: profiles.profiles.athena.stats.attributes.book_level,
                        purchasedVIP: profiles.profiles.athena.stats.attributes.book_purchased,
                        numRoyalRoyales: 0,
                        survivorTier: 0,
                        survivorPrestige: 0,
                    });
                    profiles.profiles.athena.stats.attributes.season_num = ver.season;
                    profiles.profiles.athena.stats.attributes.xp = 0
                    profiles.profiles.athena.stats.attributes.level = 1
                    profiles.profiles.athena.stats.attributes.book_purchased = false
                    profiles.profiles.athena.stats.attributes.book_level = 1
                    profiles.profiles.athena.stats.attributes.book_xp = 0
                }
            }

            if (await c.req.json()) {
                console.log(await c.req.json())
            }

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
            await profiles.updateOne({
                $set: { [`profiles.${profileId}`]: profile },
            });

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
