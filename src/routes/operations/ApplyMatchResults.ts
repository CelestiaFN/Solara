import app from "../../"
import Profile from "../../database/models/profiles"
import User from "../../database/models/users"
import Stats from "../../database/models/stats"
import { Solara } from "../../utils/errors/Solara"

export default function () {
    app.post("/celestia/api/:username/dedicated_server/ApplyMatchResults", async (c) => {
        const { Playlist, Position, XP, Eliminations, ChallengeUpdates } = await c.req.json();
        if (!Playlist || !Position || !XP || !Eliminations || ChallengeUpdates) return c.json(Solara.internal.jsonParsingFailed, 400);

        const user = await User.findOne({ username: c.req.param("username") });
        if (!user) return c.json(Solara.account.accountNotFound, 404);
        const profile = await Profile.findOne({ accountId: user.accountId });
        if (!profile) return c.json(Solara.account.accountNotFound, 404);
        const stats = await Stats.findOne({ accountId: user.accountId })
        if (!stats) return c.json(Solara.account.accountNotFound, 404);

        profile.profiles.athena.stats.attributes.xp += XP;
        stats.MatchesPlayed += 1;

        if (Playlist.includes("DefaultSolo")) {
            stats.solos.kills += Eliminations;
            stats.solos.matchplayed += 1;

            if (Position == 1) {
                stats.solos.wins += 1;
            }
        }

        if (Playlist.includes("DefaultDuo")) {
            stats.duos.kills += Eliminations;
            stats.duos.matchplayed += 1;

            if (Position == 1) {
                stats.duos.wins += 1;
            }
        }

        if (Playlist.includes("DefaultSquad")) {
            stats.squads.kills += Eliminations;
            stats.squads.matchplayed += 1;

            if (Position == 1) {
                stats.squads.wins += 1;
            }
        }

        await profile.updateOne({ $set: profile });
        await stats.updateOne({ $set: stats });

        console.log({
            Playlist,
            Position,
            XP,
            Eliminations,
            ChallengeUpdates,
        })

        return c.json({})
    })
}
