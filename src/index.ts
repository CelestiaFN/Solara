import { Hono } from 'hono'
import routes from './utils/routing/loadRoutes';
import path from 'node:path';
import EnvBuilder from './builders/environment/Builder';
import { cors } from 'hono/cors';
import logger from './utils/logger/logger';
import { Solara } from './utils/errors/Solara';
import axios from 'axios';

const app = new Hono({ strict: false })

export default app

EnvBuilder.Validate();

export const config = EnvBuilder.Register();

app.use(cors());

app.use(async (c, next) => {
    if (c.req.path !== "/images/icons/gear.png" && c.req.path !== "/favicon.ico") {
        logger.backend(`${c.req.path} | ${c.req.method}`);
    }
    await next();
});

app.use(async (c, next) => {
    if (c.req.path.startsWith("/party/") || c.req.path.startsWith("/friends/api/")) {
        try {
            const h = c.req.header();
            delete h['content-length'];
            
            const data = c.req.method !== "GET" ? await c.req.parseBody() : undefined;
            const response = await axios({
                url: "http://34.150.153.214:6969" + c.req.path,
                method: c.req.method,
                headers: h,
                data,
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

await import('./database/connect');
await import('./discord/setup');
await import('./discord/deploy');
await import('./websocket/servers')
await import('./shop/main')

await routes.loadRoutes(path.join(__dirname, "routes"), app);

logger.startup(`Solara started on port ${config.PORT}!`);

