import app from "../..";
import axios from "axios";
import { config } from "../..";

export default function () {
    app.post("/party/api/v1/Fortnite/parties", async (c) => {
        const body = await c.req.json();
        const headers = await c.req.header();

        if (!body || !headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.post(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/parties`, body, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.patch("/party/api/v1/Fortnite/parties/:pid", async (c) => {
        const body = await c.req.json();
        const headers = await c.req.header();
        const pid = await c.req.param("pid")

        if (!body || !headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.patch(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/parties/${pid}`, body, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.get("/party/api/v1/Fortnite/parties/:pid", async (c) => {
        const headers = await c.req.header();
        const pid = await c.req.param("pid")

        if (!headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.get(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/parties/${pid}`, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.get("/party/api/v1/Fortnite/user/:accountId/pings/:pingerId/parties", async (c) => {
        const headers = await c.req.header();
        const params = await c.req.param()

        if (!headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.get(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/user/${params.accountId}/pings/${params.pingerId}/parties`, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.patch("/party/api/v1/Fortnite/parties/:pid/members/:accountId/meta", async (c) => {
        const body = await c.req.json();
        const headers = await c.req.header();
        const params = await c.req.param()

        if (!body || !headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.patch(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/parties/${params.pid}/members/${params.accountId}/meta`, body, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.post("/party/api/v1/Fortnite/parties/:pid/members/:accountId/join", async (c) => {
        const body = await c.req.json();
        const headers = await c.req.header();
        const params = await c.req.param()

        if (!body || !headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.post(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/parties/${params.pid}/members/${params.accountId}/join`, body, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.post("/party/api/v1/Fortnite/parties/:pid/members/:accountId/conferences/connection", async (c) => {
        const body = await c.req.json();
        const headers = await c.req.header();
        const params = await c.req.param()

        if (!body || !headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.post(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/parties/${params.pid}/members/${params.accountId}/conferences/connection`, body, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.post("/party/api/v1/Fortnite/user/*/notifications/undelivered/count", async (c) => {
        return c.json({
            "current": [],
            "pending": [],
            "invites": [],
            "pings": []
        });
    });

    app.delete("/party/api/v1/Fortnite/parties/:pid/members/:accountId", async (c) => {
        const headers = await c.req.header();
        const params = await c.req.param()

        if (!headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.delete(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/parties/${params.pid}/members/${params.accountId}`, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });

    app.post("/party/api/v1/Fortnite/user/:accountId/pings/:pingerId", async (c) => {
        const body = await c.req.json();
        const headers = await c.req.header();
        const params = await c.req.param()

        if (!body || !headers) {
            return c.json({}, 204);
        }

        try {
            const req = await axios.post(`http://${config.ElixionIP}:6969/party/api/v1/Fortnite/user/${params.accountId}/pings/${params.pingerId}`, body, { headers });
            return c.json(req.data);
        } catch (error) {
            console.error(error);
            return c.json({}, 500);
        }
    });
}