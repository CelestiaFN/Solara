import app from "../..";
import getVersion from "../../utils/functions/getVersion";
import jwt from "jsonwebtoken"
import verifyAuth from "../../utils/handlers/verifyAuth";
import User from "../../database/models/users";
import { Solara } from "../../utils/errors/Solara";
import Matchmaking from "../../database/models/matchmakingsessions";

export default function () {
    app.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/:accountId", verifyAuth, async (c) => {
        const ver = getVersion(c)
        const query = await c.req.query()
        const user = await User.findOne({ accountId: c.req.param("accountId") })

        if (user?.banned == true) {
            return c.json(Solara.account.inactiveAccount, 400)
        }

        if (ver.build == Bun.env.PUBLICVER as any || (user && Number(user.role) <= 8)) {
            const bucketId = decodeURIComponent(decodeURIComponent(query.bucketId))

            const player_matchmakingkey = query["player.option.customKey"]
            const player_playlist = bucketId.split(":")[3];
            const player_region = bucketId.split(":")[2];

            const matchmakingData = jwt.sign(
                {
                    accountId: c.req.param("accountId"),
                    region: player_region,
                    playlist: player_playlist,
                    type: typeof player_matchmakingkey === "string" ? "custom" : "normal",
                    key: typeof player_matchmakingkey === "string" ? player_matchmakingkey : undefined,
                    bucket: bucketId,
                    version: `${ver.build}`

                },
                `${Bun.env.JWTSECRET}`
            )

            const data = matchmakingData.split(".");
            const schema = new Matchmaking({
                accountId: c.req.param("accountId"),
                sessionId: null,
                data: { bucketId: bucketId, player_region, player_playlist }
            })

            await schema.save()

            return c.json({
                serviceUrl: `ws://${Bun.env.MMIP}`,
                ticketType: "Lyra",
                payload: data[0] + "." + data[1],
                signature: data[2]
            })
        } else {
            return c.json(Solara.matchmaking.unknownSession, 400)
        }
    })
}