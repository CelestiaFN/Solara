import { Hono } from 'hono'
import routes from './utils/routing/loadRoutes';
import path from 'node:path';
import EnvBuilder from './builders/environment/Builder';
import { cors } from 'hono/cors';
import logger from './utils/logger/logger';
import { Solara } from './utils/errors/Solara';

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

await import('./database/connect');
await import('./discord/setup');
await import('./discord/deploy');

await routes.loadRoutes(path.join(__dirname, "routes"), app);

logger.startup(`Solara started on port ${config.PORT}!`);

