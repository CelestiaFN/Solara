import app from "../../"
import Profile from "../../database/models/profiles"
import User from "../../database/models/users"
import fs from 'node:fs'
import path from 'node:path'
import Stats from "../../database/models/stats"
import { Solara } from "../../utils/errors/Solara"

export default function () {
    app.post("/celestia/api/:username/dedicated_server/ApplyMatchResults", async (c) => {
        const { Playlist, Position, XP, Eliminations, ChallengeUpdates } = await c.req.json();
        console.log("hehe")
        if (!Playlist || !Position || !ChallengeUpdates) {
            return c.json(Solara.internal.jsonParsingFailed, 400);
        }

        const xpJson = await fs.promises.readFile(
            path.join(__dirname, "..", "..", "..", "static", "data", `xp.json`),
            "utf8"
        );

        const xpdata = JSON.parse(xpJson);

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

        const newXp = profile.profiles.athena.stats.attributes.xp += XP;

        for (const level of xpdata) {
            if (newXp >= level.XpToNextLevel) {
                profile.profiles.athena.stats.attributes.level += level.Level;
                profile.profiles.athena.stats.attributes.book_level += level.Level;
                profile.profiles.athena.stats.attributes.book_xp -= level.XpToNextLevel;
                profile.profiles.athena.stats.attributes.xp -= level.XpToNextLevel;

                if (profile.profiles.athena.stats.attributes.book_level >= 100) profile.profiles.athena.stats.attributes.book_level = 100;
            } else {
                profile.profiles.athena.stats.attributes.book_xp += XP;
                profile.profiles.athena.stats.attributes.xp += XP;
                break;
            }
        }

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
