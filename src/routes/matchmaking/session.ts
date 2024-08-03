import app, { config } from "../..";
import { Solara } from "../../utils/errors/Solara";
import Matchmaking from "../../database/models/matchmakingsessions";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.get("/fortnite/api/matchmaking/session/:sessionId", verifyAuth, async (c) => {
        let serverAddress;
        let serverPort;
        let sessionKey = uuidv4().toUpperCase();
        const sessionId = c.req.param("sessionId")
        const session = await Matchmaking.findOne({ sessionId: sessionId }) as any;
        try {
            let response = await axios.get(
                `http://${config.ElixionIP}:21009/session/${sessionId}`
            );
            serverAddress = response.data.ip;
            serverPort = response.data.port;
            if (!session) {
                return c.json(Solara.matchmaking.unknownSession, 400)
            }
        } catch (e) {
            console.log(e);
        }

        return c.json({
            id: sessionId,
            ownerId: uuidv4().replace(/-/gi, ""),
            ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
            serverAddress: serverAddress,
            serverPort: serverPort,
            maxPublicPlayers: 220,
            openPublicPlayers: 175,
            maxPrivatePlayers: 0,
            openPrivatePlayers: 0,
            attributes: {
                REGION_s: session.data.playerRegion,
                GAMEMODE_s: "FORTATHENA",
                ALLOWBROADCASTING_b: true,
                SUBREGION_s:
                    session.data.playerRegion == "NAE" ? "VA" : "GB",
                DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
                tenant_s: "Fortnite",
                MATCHMAKINGPOOL_s: "Any",
                STORMSHIELDDEFENSETYPE_i: 0,
                HOTFIXVERSION_i: 0,
                PLAYLISTNAME_s: session.data.playerPlaylist,
                SESSIONKEY_s: sessionKey,
                TENANT_s: "Fortnite",
                BEACONPORT_i: 15009
            },
            publicPlayers: [],
            privatePlayers: [],
            totalPlayers: 45,
            allowJoinInProgress: true,
            shouldAdvertise: true,
            isDedicated: true,
            usesStats: true,
            allowInvites: true,
            usesPresence: true,
            allowJoinViaPresence: false,
            allowJoinViaPresenceFriendsOnly: false,
            buildUniqueId: session.data.bucketId.split(":")[0],
            lastUpdated: new Date().toISOString(),
            started: false,
        });
    });
}