import app from "../..";
import Profile from "../../database/models/profiles";
import verifyAuth from "../../utils/handlers/verifyAuth";
let athena = require("../../../static/profiles/athena.json");

export default function () {
    app.post("/celestia/reset/account/:accountId", verifyAuth, async (c: any) => {
        const profile = await Profile.findOne({ accountId: c.req.param("accountId") })

        if (profile) {
            profile.profiles.athena.items = athena.items

            await profile.updateOne({ profiles: profile.profiles });

            return c.json({
                success: true
            })
        } else {
            return c.json({
                success: false
            })
        }
    })
}