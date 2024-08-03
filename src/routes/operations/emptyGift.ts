import app, { config } from "../../"
import Profile from "../../database/models/profiles"
import User from "../../database/models/users";
import { Solara } from "../../utils/errors/Solara";
import getVersion from "../../utils/functions/getVersion";
import axios from "axios";

export default function () {
    app.post("/fortnite/api/game/v3/profile/*/client/emptygift", async (c) => {
        const body = await c.req.json()
        const playerName = body.playerName;
        const user = await User.findOne({ username: playerName });
        if (!user) {
            return c.json(Solara.account.accountNotFound, 404)
        }
        const senderAccountId = user.accountId.toString();
        const profiles = await Profile.findOne({ accountId: senderAccountId });
        if (!profiles) {
            return c.json(Solara.account.accountNotFound, 404)
        }
        let profile = profiles.profiles["common_core"];

        const ver = getVersion(c);

        let profileChanges: any[] = [];
        const receiverAccountId = senderAccountId;
        let receiverProfile = await Profile.findOne({
            accountId: receiverAccountId,
        });
        if (!receiverProfile) {
            return c.json(Solara.account.accountNotFound, 404)
        }

        let athena = receiverProfile.profiles["athena"];
        let common_core = receiverAccountId == senderAccountId ? profile : receiverProfile.profiles["common_core"];

        athena.rvn += 1;
        athena.commandRevision += 1;
        athena.updated = new Date().toISOString();
        common_core.rvn += 1;
        common_core.commandRevision += 1;
        common_core.updated = new Date().toISOString();
        await receiverProfile.updateOne({
            $set: {
                [`profiles.athena`]: athena,
                [`profiles.common_core`]: common_core,
            },
        });
        try {
            await axios.get(`http://${config.ElixionIP}:6969/sendGift/${receiverAccountId}`);
        } catch { }
        if (profileChanges.length > 0 && receiverAccountId !== senderAccountId) {
            profile.rvn += 1;
            profile.commandRevision += 1;
            profile.updated = new Date().toISOString();

            await profiles.updateOne({
                $set: { [`profiles.${"common_core"}`]: profile },
            });
        }
        if (c.req.query("rvn") || (-1 != ver.build && ver.build >= 12.2) ? profile.commandRevision : profile.rvn) {
            profileChanges = [
                {
                    changeType: "fullProfileUpdate",
                    profile: profile,
                },
            ];
        }
        return c.json({
            profileRevision: profile.rvn || 0,
            profileId: "common_core",
            profileChangesBaseRevision: profile.rvn,
            profileChanges: profileChanges,
            notifications: [],
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            responseVersion: 1,
        });
    });
}