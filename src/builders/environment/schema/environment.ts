import { z } from "zod";

export const ConfigSchema = z.object({
    PORT: z.number(),
    JWTSECRET: z.string(),
    DB_URL: z.string(),
    MAINTENANCE: z.string(),
    PUBLICVER: z.string(),
    BOT_TOKEN: z.string(),
    SEASON: z.string(),
    WL: z.string(),
    EMERGENCY_NOTICE_TITLE: z.string(),
    EMERGENCY_NOTICE_BODY: z.string(),
    SERVICETYPE: z.string(),
    MMIP: z.string(),
    LYRASECURE: z.string()
});