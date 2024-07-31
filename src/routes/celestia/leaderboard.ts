import app from "../..";
import Stats from "../../database/models/stats";
import User from "../../database/models/users"; 
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.get("/api/launcher/leaderboard", async (c) => {
        try {
            const allStats = await Stats.find({});
            const allUsers = await User.find({}); 

            const formattedStats = allStats.map(stat => {
                const user = allUsers.find(user => user.accountId.toString() === stat.accountId.toString());

                if (user) {
                    const totalKills = stat.solos.kills + stat.duos.kills + stat.squads.kills + stat.ltm.kills;
                    const totalWins = stat.solos.wins + stat.duos.wins + stat.squads.wins + stat.ltm.wins;

                    return {
                        username: user.username,
                        kills: totalKills,
                        wins: totalWins
                    };
                } else {
                    return null;
                }
            }).filter(stat => stat !== null); 

            formattedStats.sort((a, b) => {
                if (b.kills !== a.kills) {
                    return b.kills - a.kills; 
                } else {
                    return b.wins - a.wins; 
                }
            });

            const rankedStats = formattedStats.map((stat, index) => ({
                rank: index + 1,
                ...stat
            }));

         return c.json({
                stats: rankedStats
            });
        } catch (err) {
            console.error(err);
        }
    });
}