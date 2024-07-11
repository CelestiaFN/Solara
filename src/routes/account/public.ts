import app from "../..";
import User from "../../database/models/users";
import verifyAuth from "../../utils/handlers/verifyAuth";

export default function () {
    app.get("/account/api/public/account/:accountId", verifyAuth, async (c) => {
        var user: any = await User.findOne({ accountId: c.req.param("accountId") });

        return c.json({
            id: user.accountId,
            displayName: user.username,
            externalAuths: {},
        });
    });

    app.get("/account/api/public/account/:accountId/externalAuths", async (c) => {
        c.status(204);
        return c.json({});
    });

    app.get("/account/api/public/account/displayName/:username", verifyAuth, async (c) => {
        var user: any = await User.findOne({ username: c.req.param("username") });

        return c.json({
            id: user.accountId,
            displayName: user.username,
            externalAuths: {},
        });
    });

    app.post("/account/api/public/account/:accountId", verifyAuth, async (c) => {
        var user: any = await User.findOne({ accountId: c.req.param("accountId") });

        return c.json({
            id: user.accountId,
            displayName: user.username,
            externalAuths: {},
        });
    });

    app.get("/account/api/public/account", verifyAuth, async (c) => {
        var response = [];
        const { accountId } = c.req.query();

        if (typeof accountId == "string") {
            let user = await User.findOne({
                accountId: accountId,
                banned: false,
            }).lean();
            if (user) {
                response.push({
                    id: user.accountId,
                    displayName: user.username,
                    externalAuths: {},
                });
            }
        } else if (Array.isArray(accountId)) {
            let users = await User.find({
                accountId: { $in: accountId },
                banned: false,
            }).lean();
            if (users) {
                for (let user of users) {
                    if (response.length >= 100) break;
                    response.push({
                        id: user.accountId,
                        displayName: user.username,
                        externalAuths: {},
                    });
                }
            }
        }

        return c.json(response);
    });
}