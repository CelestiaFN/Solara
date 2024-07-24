import app from "../../"
import User from "../../database/models/users"
import { Solara } from "../../utils/errors/Solara"
import verifyAuth from "../../utils/handlers/verifyAuth"

export default function () {
    app.post("/fortnite/api/game/v2/toxicity/account/:unsafeReporter/report/:reportedPlayer", verifyAuth, async (c) => {
        const reporter = c.req.param("unsafeReporter")
        const reportedPlayer = c.req.param("reportedPlayer")
        const { reason, details } = await c.req.json()

        if (!reason || !details) return c.json(Solara.basic.notAcceptable, 404)

        const rPlayer = await User.findOne({ accountId: reportedPlayer })

        if (!rPlayer) return c.json(Solara.account.accountNotFound, 404)

        rPlayer.Reports += 1

        await rPlayer.save()

        console.log(reason, details)

        return c.json({
            success: true,
        }, 200)
    })
}