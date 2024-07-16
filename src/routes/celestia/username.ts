import app from "../..";
import verifyAuth from "../../utils/handlers/verifyAuth";
import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";

export default function () {
    app.post("/api/launcher/edit/username", verifyAuth, async (c) => {
        const { username } = await c.req.json()
        const auth = c.req.header("authorization")

        const token = await Tokens.findOne({ token: auth })

        if (!token) {
            return c.json([], 404)
        }

        const user = await User.findOne({ accountId: token.accountId })

        if (!user) {
            return c.json([], 404)
        }

        const existinguser = await User.findOne({ username: username })

        const blacklisted_words = [
            "TIVA",
            "Itztiva",
            "ltztiva",
            "Ltztiva",
            "ltztiva  ",
            
        ]

        if (blacklisted_words.some(word => username.toUpperCase().includes(word))) {
            return c.json({
                sucess: false
            })
        }

        if (!existinguser) {
            user.username = username;

            await user.save()

            return c.json({
                sucess: true
            })
        } else {
            return c.json({
                sucess: false
            })
        }
    })
}