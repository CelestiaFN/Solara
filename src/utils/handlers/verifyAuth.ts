import Tokens from "../../database/models/tokens";
import User from "../../database/models/users";
import { Solara } from "../../utils/errors/Solara";

export default async function verifyAuth(c: any, next: any) {
    try {
        const authHeader = c.req.header("Authorization");

        if (!authHeader) {
            return c.json(Solara.authentication.invalidToken, 401);
        }

        const tokenStr = authHeader.split(' ').pop().trim();
        const token = await Tokens.findOne({ token: tokenStr });

        if (!token) {
            return c.json(Solara.authentication.invalidToken.variable([tokenStr]), 401);
        }

        const user = await User.findOne({ accountId: token.accountId });

        if (!user) {
            return c.json(Solara.authentication.invalidToken.variable([token.token]), 401);
        }

        if (!user.isServer) {
            const hwidchecks = await User.find({ hwid: user.hwid });

            if (hwidchecks.some((hwidcheck) => hwidcheck.banned)) {
                return c.json(Solara.account.disabledAccount, 404);
            }
        }

        if (!user.isServer) {
            const accountId = c.req.param("accountId");
            if (accountId && token.accountId !== accountId) {
                return c.json(Solara.authentication.invalidToken.variable([token.token]), 401);
            }
        }

        await next();
    } catch (error) {
        console.error('Error:', error);
        return c.json(Solara.internal.unknownError, 500);
    }
}
