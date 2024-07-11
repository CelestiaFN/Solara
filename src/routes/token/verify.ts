import app from "../..";
import jwt from 'jsonwebtoken'
import Tokens from "../../database/models/tokens";
import { v4 } from 'uuid'
import User from "../../database/models/users";
import { Solara } from "../../utils/errors/Solara";

export default function () {
    app.get("/fortnite/api/game/v2/profileToken/verify/:accountId", async (c) => {
        return c.json([]);
    });

    app.post("/fortnite/api/game/v2/profileToken/verify/:accountId", async (c) => {
        return c.json([]);
    });

    app.get("/account/api/oauth/verify", async (c) => {
        let headertoken = c.req.header("authorization")!.replace("bearer ", "");
        let token = await Tokens.findOne({ token: headertoken })

        if (!token) return c.json(Solara.authentication.invalidToken, 415)

        var user = await User.findOne({ accountId: token.accountId })

        if (!user) return c.json(Solara.authentication.invalidToken, 415)

        const decodedToken = jwt.decode(headertoken) as any;
        const deviceId = v4();

        function DateAddHours(pdate: any, number: any) {
            let date = pdate;
            date.setHours(date.getHours() + number);

            return date;
        }

        if (user.banned == true) {
            return c.json([], 400)
        }

        return c.json({
            token: token,
            session_id: decodedToken.jti,
            token_type: "bearer",
            client_id: decodedToken.clid,
            internal_client: true,
            client_service: "fortnite",
            account_id: user.accountId,
            expires_in: Math.round(((DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).getTime()) - (new Date().getTime())) / 1000),
            expires_at: DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).toISOString(),
            auth_method: token.type,
            display_name: user.username,
            app: "fortnite",
            in_app_id: user.accountId,
            device_id: deviceId,
           // perms: []
        });
    })
}