import { Hono } from 'hono'
import routes from './utils/routing/loadRoutes';
import path from 'node:path';
import EnvBuilder from './builders/environment/Builder';
import { cors } from 'hono/cors';
import logger from './utils/logger/logger';
import axios from 'axios';
import { startHttps } from './https/setup';
import fs from 'node:fs'
import { HTTPException } from 'hono/http-exception';

const app = new Hono({ strict: false })

export default app

EnvBuilder.Validate();

export const config = EnvBuilder.Register();

app.use(cors());

app.use(async (c, next) => {
    if (c.req.path !== "/images/icons/gear.png" && c.req.path !== "/favicon.ico") {
        const log = `${c.req.path} | ${c.req.method}\n`;
        fs.appendFile('static/logs/routes.txt', log, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (config.isProd === 'false') {
        if (c.req.path !== "/images/icons/gear.png" && c.req.path !== "/favicon.ico") {
            logger.backend(`${c.req.path} | ${c.req.method}`);
        }
    }
    await next();
});

app.use(async (c, next) => {
    if (c.req.path.includes("/friends")) {
        if (c.req.path === "/party/api/v1/Fortnite/parties") {
            await next()
        }
        try {
            const h = c.req.header();
            delete h['content-length'];

            let data = c.req.method !== "GET" ? await c.req.parseBody() || await c.req.json() : undefined;
            const response = await axios({
                url: `http://${config.ElixionIP}:6969` + c.req.path,
                method: c.req.method,
                headers: h,
                data: data,
                responseType: 'json'
            });

            return c.json(response.data);
        } catch (e: any) {
            console.error(e);
            const errorResponse = e.response ? e.response.data : "Error occurred";
            return c.body(errorResponse);
        }
    } else {
        await next();
    }
});

app.onError((err, c) => {
    if (typeof err !== 'object') {
        return c.json({
            error: err,
            status: 500
        })
    } else {
        if (err instanceof HTTPException) {
            console.log("HTTPException")
            return err.getResponse()
        }
    }

    return c.json({
        error: err.message,
        status: 500
    })
})

await import('./database/connect');
await import('./discord/setup');
await import('./discord/deploy');
await import('./websocket/servers')
await import('./shop/main')

await startHttps();
await routes.loadRoutes(path.join(__dirname, "routes"), app);

// app.use(async (c, next) => {
//     logger.error(c.req.method + c.req.path);
//     await next();
// });


logger.startup(`Solara started on port ${config.PORT}!`);