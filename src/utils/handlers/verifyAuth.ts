import Tokens from "../../database/models/tokens";
import { Solara } from "../../utils/errors/Solara";

export default async function verifyAuth(c: any, next: any) {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
        return c.json(Solara.authentication.invalidToken, 401);
    }

    const tokenStr = authHeader.split(' ').pop().trim();

    const token = await Tokens.findOne({ token: tokenStr });

    if (!token) {
        return c.json(Solara.authentication.invalidToken, 401);
    }

    await next();
}
