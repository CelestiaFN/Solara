import app from "../..";
import User from "../../database/models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Tokens from "../../database/models/tokens";
import { updateTokens } from "../../utils/functions/updateTokens";
import { Solara } from "../../utils/errors/Solara";
import { v4 as uuidv4 } from "uuid";

export default function () {
    app.post("/account/api/oauth/token", async (c: any) => {
        try {
            const body: any = await c.req.parseBody();

            function base64Decode(str: any) {
                return Buffer.from(str, "base64").toString();
            }

            const tokenHeader = c.req.header("Authorization");
            let clientId;

            clientId = base64Decode((tokenHeader || "").split(" ")[1]).split(":");


            if (body.grant_type === "password") {
                const deviceId = uuidv4();

                const user = await User.findOne({ email: body.username });
                if (!user || !(await bcrypt.compare(body.password, user.password))) {
                    return c.json(
                        Solara.authentication.oauth.invalidAccountCredentials,
                        400
                    );
                }

                if (user.banned == true) {
                    return c.json(Solara.account.inactiveAccount, 404);
                }

                const accessToken = jwt.sign(
                    {
                        email: user.email,
                        password: user.password,
                        type: "access",
                        creation_date: new Date(),
                        hours_expire: 28800,
                    },
                    `${Bun.env.JWT_SECRET}`
                );

                const refreshToken = jwt.sign(
                    {
                        email: user.email,
                        password: user.password,
                        type: "refresh",
                        creation_date: new Date(),
                        hours_expire: 28800,
                    },
                    `${Bun.env.JWT_SECRET}`
                );

                updateTokens(user.accountId, "refreshToken", accessToken, [
                    `account:api:public ALL
fortnite:cloudstorage:user:${user.accountId}	READ
fortnite:cloudstorage:user:${user.accountId}:*	READ
fortnite:cloudstorage:user:${user.accountId}:ClientSettings.sav	ALL
fortnite:calendar	READ
fortnite:cloudstorage:system	READ
fortnite:cloudstorage:system:*	READ
fortnite:matchmaking:session	READ
fortnite:matchmaking:session:*	READ
fortnite:matchmaking:session:*:invite	CREATE DELETE
fortnite:matchmaking:session:*:join:${user.accountId}	CREATE
fortnite:matchmaking:session:${user.accountId}:invite	READ
fortnite:stats	READ
fortnite:stats:*	READ
xmpp:session:*:${user.accountId}
                    `,
                ]);

                updateTokens(user.accountId, "accessToken", accessToken, [
                    `account:api:public ALL
fortnite:cloudstorage:user:${user.accountId}	READ
fortnite:cloudstorage:user:${user.accountId}:*	READ
fortnite:cloudstorage:user:${user.accountId}:ClientSettings.sav	ALL
fortnite:calendar	READ
fortnite:cloudstorage:system	READ
fortnite:cloudstorage:system:*	READ
fortnite:matchmaking:session	READ
fortnite:matchmaking:session:*	READ
fortnite:matchmaking:session:*:invite	CREATE DELETE
fortnite:matchmaking:session:*:join:${user.accountId}	CREATE
fortnite:matchmaking:session:${user.accountId}:invite	READ
fortnite:stats	READ
fortnite:stats:*	READ
xmpp:session:*:${user.accountId}
                    `,
                ]);

                return c.json({
                    access_token: accessToken,
                    expires_in: 28800,
                    expires_at: "9999-12-02T01:12:01.100Z",
                    token_type: "bearer",
                    refresh_token: refreshToken,
                    refresh_expires: 86400,
                    refresh_expires_at: "9999-12-02T01:12:01.100Z",
                    account_id: user.accountId,
                    client_id: clientId,
                    internal_client: true,
                    client_service: "fortnite",
                    displayName: user.username,
                    app: "fortnite",
                    in_app_id: user.accountId,
                    device_id: deviceId,
                });
            } else if (body.grant_type === "client_credentials") {
                return c.json({
                    access_token: jwt.sign(uuidv4(), `${Bun.env.JWT_SECRET}`),
                    expires_in: 28800,
                    expires_at: "9999-12-02T01:12:01.100Z",
                    token_type: "bearer",
                    client_id: clientId,
                    internal_client: true,
                    client_service: "fortnite",
                });
            } else if (body.grant_type === "refresh_token") {
                const deviceId: any = uuidv4();
                const decodedToken: any = jwt.decode(body.refresh_token);
                const user: any = await User.findOne({ email: decodedToken.email });

                if (!user || decodedToken.password !== user.password) {
                    return c.json(
                        Solara.authentication.oauth.invalidAccountCredentials,
                        400
                    );
                }

                const accessToken = jwt.sign(
                    {
                        email: user.email,
                        password: user.password,
                        type: "access",
                        creation_date: new Date(),
                        hours_expire: 28800,
                    },
                    `${Bun.env.JWT_SECRET}`
                );

                return c.json({
                    access_token: accessToken,
                    expires_in: 28800,
                    expires_at: "9999-12-02T01:12:01.100Z",
                    token_type: "bearer",
                    refresh_token: body.refresh_token,
                    refresh_expires: 86400,
                    refresh_expires_at: "9999-12-02T01:12:01.100Z",
                    account_id: user.accountId,
                    client_id: clientId,
                    internal_client: true,
                    client_service: "fortnite",
                    displayName: user.username,
                    app: "fortnite",
                    in_app_id: user.accountId,
                    device_id: deviceId,
                });
            } else if (body.grant_type === "device_auth") {
                const user: any = await User.findOne({ accountId: body.account_id });

                if (user && body.secret !== user.password) {
                    return c.json(
                        Solara.authentication.oauth.invalidAccountCredentials,
                        400
                    );
                }
            } else if (body.grant_type === "exchange_code") {
                if (!body.exchange_code) {
                    return c.json({ error: "exchange_code_missing" }, 400);
                }

                try {
                    const token = await Tokens.findOne({ token: body.exchange_code });

                    if (!token) {
                        return c.json(Solara.authentication.invalidToken, 400);
                    }

                    const exchange = token;
                    const user = await User.findOne({
                        accountId: exchange.accountId,
                    }).lean();
                    await Tokens.deleteOne({ accountId: exchange.accountId });

                    if (!user) {
                        return c.json(Solara.account.accountNotFound, 400);
                    }
                    
                    if (user.banned == true) {
                        return c.json(Solara.account.inactiveAccount, 400);
                    }
 
                    const deviceId = uuidv4();

                    const accessToken = jwt.sign(
                        {
                            email: user.email,
                            password: user.password,
                            type: "access",
                            creation_date: new Date(),
                            hours_expire: 28800,
                        },
                        `${Bun.env.JWTSECRET}`
                    );

                    const refreshToken = jwt.sign(
                        {
                            email: user.email,
                            password: user.password,
                            type: "refresh",
                            creation_date: new Date(),
                            hours_expire: 28800,
                        },
                        `${Bun.env.JWTSECRET}`
                    );

                    updateTokens(user.accountId, "refreshToken", refreshToken, [
                        `account:api:public ALL
fortnite:cloudstorage:user:${user.accountId}	READ
fortnite:cloudstorage:user:${user.accountId}:*	READ
fortnite:cloudstorage:user:${user.accountId}:ClientSettings.sav	ALL
fortnite:calendar	READ
fortnite:cloudstorage:system	READ
fortnite:cloudstorage:system:*	READ
fortnite:matchmaking:session	READ
fortnite:matchmaking:session:*	READ
fortnite:matchmaking:session:*:invite	CREATE DELETE
fortnite:matchmaking:session:*:join:${user.accountId}	CREATE
fortnite:matchmaking:session:${user.accountId}:invite	READ
fortnite:stats	READ
fortnite:stats:*	READ
xmpp:session:*:${user.accountId}
                    `,
                    ]);

                    updateTokens(user.accountId, "accessToken", accessToken, [
                        `account:api:public ALL
fortnite:cloudstorage:user:${user.accountId}	READ
fortnite:cloudstorage:user:${user.accountId}:*	READ
fortnite:cloudstorage:user:${user.accountId}:ClientSettings.sav	ALL
fortnite:calendar	READ
fortnite:cloudstorage:system	READ
fortnite:cloudstorage:system:*	READ
fortnite:matchmaking:session	READ
fortnite:matchmaking:session:*	READ
fortnite:matchmaking:session:*:invite	CREATE DELETE
fortnite:matchmaking:session:*:join:${user.accountId}	CREATE
fortnite:matchmaking:session:${user.accountId}:invite	READ
fortnite:stats	READ
fortnite:stats:*	READ
xmpp:session:*:${user.accountId}
                    `,
                    ]);
                    return c.json({
                        access_token: accessToken,
                        expires_in: 28800,
                        expires_at: "9999-12-02T01:12:01.100Z",
                        token_type: "bearer",
                        refresh_token: refreshToken,
                        refresh_expires: 86400,
                        refresh_expires_at: "9999-12-02T01:12:01.100Z",
                        account_id: user.accountId,
                        client_id: clientId,
                        internal_client: true,
                        client_service: "fortnite",
                        displayName: user.username,
                        app: "fortnite",
                        in_app_id: user.accountId,
                        device_id: deviceId,
                    });
                } catch (error) {
                    console.error("Error processing exchange code:", error);
                    return c.json({ error: "internal_server_error" }, 500);
                }
            } else {
                return c.json({ error: "unsupported_grant_type" }, 400);
            }
        } catch (error) {
            console.error(error);
            return c.json({ error: "internal_server_error" }, 500);
        }
    });
}
