import app from "../..";
import Stats from "../../database/models/stats";
import verifyAuth from "../../utils/handlers/verifyAuth";
import { Solara } from "../../utils/errors/Solara";


export default function () {
    app.get("/statsproxy/api/statsv2/account/:accountId", verifyAuth, async (c) => {
        const accountId = c.req.param("accountId");
        const startTime = c.req.query("startTime");
        const endTime = c.req.query("endTime");

        const stats = await Stats.findOne({ accountId });

        if (!stats) return c.json(Solara.account.accountNotFound, 400);
        
        return c.json({
            startTime,
            endTime,
            stats: {
                br_score_keyboardmouse_m0_playlist_DefaultSolo: 859,
                br_kills_keyboardmouse_m0_playlist_DefaultSolo: stats.solos.kills,
                br_playersoutlived_keyboardmouse_m0_playlist_DefaultSolo: 0,
                br_matchesplayed_keyboardmouse_m0_playlist_DefaultSolo: stats.solos.matchplayed,
                br_placetop25_keyboardmouse_m0_playlist_DefaultSolo: 0,
                br_placetop1_keyboardmouse_m0_playlist_DefaultSolo: stats.solos.wins,

                br_score_keyboardmouse_m0_playlist_DefaultDuo: 0,
                br_kills_keyboardmouse_m0_playlist_DefaultDuo: stats.duos.kills,
                br_playersoutlived_keyboardmouse_m0_playlist_DefaultDuo: 0,
                br_matchesplayed_keyboardmouse_m0_playlist_DefaultDuo: stats.duos.matchplayed,
                br_placetop25_keyboardmouse_m0_playlist_DefaultDuo: 0,
                br_placetop1_keyboardmouse_m0_playlist_DefaultDuo: stats.duos.wins,

                br_score_keyboardmouse_m0_playlist_DefaultSquad: 0,
                br_kills_keyboardmouse_m0_playlist_DefaultSquad: stats.squads.kills,
                br_playersoutlived_keyboardmouse_m0_playlist_DefaultSquad: 0,
                br_matchesplayed_keyboardmouse_m0_playlist_DefaultSquad: stats.squads.matchplayed,
                br_placetop25_keyboardmouse_m0_playlist_DefaultSquad: 0,
                br_placetop1_keyboardmouse_m0_playlist_DefaultSquad: stats.squads.wins,

                br_score_keyboardmouse_m0_playlist_50v50: 0,
                br_kills_keyboardmouse_m0_playlist_50v50: stats.ltm.kills,
                br_playersoutlived_keyboardmouse_m0_playlist_50v50: 0,
                br_matchesplayed_keyboardmouse_m0_playlist_50v50: stats.ltm.matchplayed,
                br_placetop25_keyboardmouse_m0_playlist_50v50: 0,
                br_placetop1_keyboardmouse_m0_playlist_50v50: stats.ltm.wins,
            },
            maxSize: 1000,
            accountId: stats.accountId,
        });
    });
}