import app from "../..";
import axios from "axios";
import Friends from "../../database/models/friends";
import { config } from "../..";
import { Solara } from "../../utils/errors/Solara";
import verifyAuth from "../../utils/handlers/verifyAuth";
import { DateTime } from "luxon";

export default function () {
    app.get("/friends/api/public/friends/:accountId", async (c) => {
        const headers = await c.req.header();

        if (!headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.get(`http://${config.ElixionIP}:6969/friends/api/public/friends/${c.req.param("accountId")}`, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.get("/friends/api/v1/:accountId/summary", verifyAuth, async (c) => {
        let response = {
            "friends": [],
            "incoming": [],
            "outgoing": [],
            "suggested": [],
            "blocklist": []
        } as any;
        const friends = await Friends.findOne({ accountId: c.req.param("accountId") });
        if (!friends) return c.json(Solara.friends.invalidData, 404)

        friends?.list.accepted.forEach((acceptedFriend: any) => {
            const isDuplicate = response.friends.some((friend: any) => friend.accountId === acceptedFriend.accountId);
            if (!isDuplicate) {
                response.friends.push({
                    "accountId": acceptedFriend.accountId,
                    "groups": [],
                    "mutual": 0,
                    "alias": acceptedFriend.alias ? acceptedFriend.alias : "",
                    "note": "",
                    "favorite": false,
                    "created": "2024-07-27T20:59:45+02:00",
                });
            }
        });

        friends?.list.incoming.forEach((incomingFriend: any) => {
            const isDuplicate = response.incoming.some((friend: any) => friend.accountId === incomingFriend.accountId);
            if (!isDuplicate) {
                response.incoming.push({
                    "accountId": incomingFriend?.accountId,
                    "mutual": 0,
                    "favorite": false,
                    "created": "2024-07-27T20:59:45+02:00",
                });
            }
        });
        friends?.list.outgoing.forEach((outgoingFriend: any) => {
            const isDuplicate = response.outgoing.some((friend: any) => friend.accountId === outgoingFriend.accountId);
            if (!isDuplicate) {
                response.outgoing.push({
                    "accountId": outgoingFriend?.accountId,
                    "favorite": false
                });
            }
        });
        friends?.list.blocked.forEach((blockedFriend: any) => {
            const isDuplicate = response.blocklist.some((friend: any) => friend.accountId === blockedFriend.accountId);
            if (!isDuplicate) {
                response.blocklist.push({
                    "accountId": blockedFriend?.accountId
                });
            }
        });
        return c.json(response);
    });

    app.post("/friends/api/public/friends/:accountId", async (c) => {
        const headers = await c.req.header();

        if (!headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.post(`http://${config.ElixionIP}:6969/friends/api/public/friends/${c.req.param("accountId")}`, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });
}