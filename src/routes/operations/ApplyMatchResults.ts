import app from "../../"
import Profile from "../../database/models/profiles"
import User from "../../database/models/users"
import Stats from "../../database/models/stats"
import { Solara } from "../../utils/errors/Solara"

export default function () {
    app.post("/celestia/api/:username/dedicated_server/ApplyMatchResults", async (c) => {
        const { Playlist, Position, XP, Eliminations, ChallengeUpdates } = await c.req.json();
        console.log({
            Playlist,
            Position,
            XP,
            Eliminations,
            ChallengeUpdates
        })

        if (!Playlist || !Position || !ChallengeUpdates) {
            return c.json(Solara.internal.jsonParsingFailed, 400);
        }

        const user = await User.findOne({ username: c.req.param("username") });
        if (!user) {
            return c.json(Solara.account.accountNotFound, 404);
        }
        const profile = await Profile.findOne({ accountId: user.accountId });
        if (!profile) {
            return c.json(Solara.account.accountNotFound, 404);
        }
        const stats = await Stats.findOne({ accountId: user.accountId })
        if (!stats) {
            return c.json(Solara.account.accountNotFound, 404);
        }

        profile.profiles.athena.stats.attributes.xp += XP;
        stats.MatchesPlayed += 1;

        if (Playlist.includes("DefaultSolo")) {
            stats.solos.kills += Eliminations;
            stats.solos.matchplayed += 1;

            if (Position == 1) {
                stats.solos.wins += 1;
            }

            await Profile.updateOne({ accountId: user.accountId }, { $set: profile });
            await Stats.updateOne({ accountId: user.accountId }, { $set: stats });
    
            return c.json({})
        }

        if (Playlist.includes("DefaultDuo")) {
            stats.duos.kills += Eliminations;
            stats.duos.matchplayed += 1;

            if (Position == 1) {
                stats.duos.wins += 1;
            }

            await Profile.updateOne({ accountId: user.accountId }, { $set: profile });
            await Stats.updateOne({ accountId: user.accountId }, { $set: stats });
    
            return c.json({})
        }

        if (Playlist.includes("DefaultSquad")) {
            stats.squads.kills += Eliminations;
            stats.squads.matchplayed += 1;

            if (Position == 1) {
                stats.squads.wins += 1;
            }
            await Profile.updateOne({ accountId: user.accountId }, { $set: profile });
            await Stats.updateOne({ accountId: user.accountId }, { $set: stats });
    
            return c.json({})
        }

        return c.json({})
    })
}
